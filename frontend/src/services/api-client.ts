import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { AUTH_STORAGE_KEYS } from "@/lib/auth-storage";
import { useAuthStore } from "@/stores/auth-store";
import type {
  ApiError,
  ApiErrorDetails,
  ApiMeta,
  ApiResponse,
  PaginatedData,
} from "@/types/api";
import type { AuthTokens } from "@/types/auth";

type RequestConfigWithRetry = InternalAxiosRequestConfig & { _retry?: boolean };

const AUTH_PATHS_NO_REFRESH = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/logout",
] as const;

let refreshSessionPromise: Promise<void> | null = null;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const EMPTY_ERROR_DETAILS: ApiErrorDetails = {
  formErrors: [],
  fieldErrors: {},
};

const toErrorDetails = (details: unknown): ApiErrorDetails => {
  if (!details || typeof details !== "object") return EMPTY_ERROR_DETAILS;

  const rawFormErrors = (details as { formErrors?: unknown }).formErrors;
  const rawFieldErrors = (details as { fieldErrors?: unknown }).fieldErrors;

  const formErrors = Array.isArray(rawFormErrors)
    ? rawFormErrors.filter(
        (item): item is string => typeof item === "string" && item.length > 0,
      )
    : [];

  const fieldErrors: Record<string, string[]> = {};
  if (rawFieldErrors && typeof rawFieldErrors === "object") {
    for (const [field, value] of Object.entries(rawFieldErrors)) {
      if (!Array.isArray(value)) continue;
      const messages = value.filter(
        (item): item is string => typeof item === "string" && item.length > 0,
      );
      if (messages.length > 0) {
        fieldErrors[field] = messages;
      }
    }
  }

  return { formErrors, fieldErrors };
};

const buildApiError = (
  backendError: ApiResponse<unknown>["error"] | null | undefined,
  statusCode: number,
  fallbackMessage: string,
  fallbackCode?: string,
): ApiError => {
  const details = toErrorDetails(backendError?.details);
  return {
    message: backendError?.message ?? details.formErrors[0] ?? fallbackMessage,
    errorCode: backendError?.code ?? fallbackCode,
    statusCode,
    details,
  };
};

const requestPath = (config: InternalAxiosRequestConfig): string => {
  const url = config.url ?? "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }
  return url.startsWith("/") ? url : `/${url}`;
};

const isAuthPathExcluded = (path: string): boolean =>
  AUTH_PATHS_NO_REFRESH.some((p) => path === p || path.startsWith(`${p}?`));

const redirectToLogin = (): void => {
  if (typeof window === "undefined") return;

  const pathWithQuery = window.location.pathname + window.location.search;
  const segments = window.location.pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const locales = ["en", "vi"];
  const locale = locales.includes(maybeLocale) ? maybeLocale : "";
  const next = encodeURIComponent(pathWithQuery);

  if (locale) {
    window.location.assign(`/${locale}/login?next=${next}`);
    return;
  }

  window.location.assign(`/login?next=${next}`);
};

const clearAuthAndRedirectToLogin = (): void => {
  useAuthStore.getState().clearAuth();
  redirectToLogin();
};

const callRefreshTokenApi = async (): Promise<void> => {
  const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const res = await axios.post<ApiResponse<AuthTokens>>(
    `${BASE_URL}/auth/refresh-token`,
    { refreshToken },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    },
  );

  const body = res.data;
  if (!body.success || !body.data) {
    throw buildApiError(body.error, res.status, "Refresh failed");
  }

  useAuthStore.getState().setTokens({
    accessToken: body.data.accessToken,
    refreshToken: body.data.refreshToken,
  });
};

const refreshSession = (): Promise<void> => {
  if (!refreshSessionPromise) {
    refreshSessionPromise = callRefreshTokenApi().finally(() => {
      refreshSessionPromise = null;
    });
  }
  return refreshSessionPromise;
};

/**
 * Request interceptor - attach auth token if available
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
        : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor - unwrap ApiResponse, expose meta, map errors
 *
 * On success:  response.data  = T (unwrapped)
 *              response.meta  = ApiMeta | undefined
 * On failure:  rejects with ApiError (message, errorCode, statusCode)
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const body = response.data;

    if (body.success) {
      return {
        ...response,
        data: body.data,
        meta: body.meta,
      };
    }

    // Backend returned success: false with an error payload
    const error = buildApiError(
      body.error,
      response.status,
      "An error occurred",
    );

    return Promise.reject(error);
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const body = error.response?.data;

    // Attempt to read the nested error object from backend contract
    const backendError = body && typeof body === "object" ? body.error : null;

    const apiError = buildApiError(
      backendError,
      error.response?.status ?? 500,
      error.message || "Network error occurred",
      backendError ? undefined : "NETWORK_ERROR",
    );

    const originalRequest = error.config as RequestConfigWithRetry | undefined;
    const status = error.response?.status;

    if (
      typeof window !== "undefined" &&
      status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const path = requestPath(originalRequest);
      if (!isAuthPathExcluded(path)) {
        const storedRefresh = localStorage.getItem(
          AUTH_STORAGE_KEYS.refreshToken,
        );
        if (storedRefresh) {
          try {
            await refreshSession();
            originalRequest._retry = true;
            return apiClient.request(originalRequest);
          } catch {
            clearAuthAndRedirectToLogin();
            return Promise.reject(apiError);
          }
        } else {
          clearAuthAndRedirectToLogin();
          return Promise.reject(apiError);
        }
      }
    }

    return Promise.reject(apiError);
  },
);

/**
 * Generic fetcher for SWR / simple GET calls.
 * Returns the unwrapped data (T), not the full ApiResponse.
 */
export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await apiClient.get<T>(url);
  return response.data as T;
};

/**
 * Helper for paginated GET calls.
 * Returns { items: T[], meta: ApiMeta }.
 */
export const paginatedFetcher = async <T>(
  url: string,
): Promise<PaginatedData<T>> => {
  const response = await apiClient.get<T[]>(url);
  const axiosResponse = response as AxiosResponse<T[]> & { meta?: ApiMeta };
  return {
    items: response.data as T[],
    meta: axiosResponse.meta ?? { page: 1, limit: 10, total: 0 },
  };
};

export default apiClient;
