import type { ApiResponse } from "@/types/api";

type OkInit = {
  status?: number;
  message?: string;
  headers?: HeadersInit;
};

type FailInit = {
  status?: number;
  errorCode?: string;
  headers?: HeadersInit;
};

export function ok<T>(data: T, init: OkInit = {}) {
  const body: ApiResponse<T> = {
    success: true,
    data,
    ...(init.message ? { message: init.message } : {}),
  };

  return Response.json(body, {
    status: init.status ?? 200,
    headers: init.headers,
  });
}

export function fail(message: string, init: FailInit = {}) {
  const body: ApiResponse<null> = {
    success: false,
    data: null,
    message,
    ...(init.errorCode ? { errorCode: init.errorCode } : {}),
  };

  return Response.json(body, {
    status: init.status ?? 400,
    headers: init.headers,
  });
}

