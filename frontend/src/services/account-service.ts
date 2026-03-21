import apiClient from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  Account,
  CreateAccountInput,
  GetAccountListParams,
  UpdateAccountInput,
} from "@/types/account";

type BackendAccount = {
  AccountID?: number;
  Username?: string;
  Email?: string;
  Role?: string;
  FullName?: string | null;
  Profile?: {
    ProfileID?: number;
    FullName?: string | null;
    Avatar?: string | null;
    Status?: string | null;
  } | null;
  // Some endpoints may already return camelCase
  accountId?: number;
  username?: string;
  email?: string;
  role?: string;
  fullName?: string | null;
  profile?: {
    profileId?: number;
    fullName?: string | null;
    avatar?: string | null;
    status?: string | null;
  } | null;
};

function mapAccountFromBackend(input: BackendAccount): Account {
  const profile = (input.profile ?? input.Profile) as 
    | (typeof input.profile) 
    | (typeof input.Profile) 
    | null
    | undefined;

  const resolvedFullName =
    (profile as any)?.fullName ??
    (profile as any)?.FullName ??
    input.fullName ??
    input.FullName ??
    null;

  const resolvedProfileId =
    (profile as any)?.profileId ?? (profile as any)?.ProfileID ?? 0;

  const resolvedAvatar =
    (profile as any)?.avatar ?? (profile as any)?.Avatar ?? null;

  const resolvedStatus =
    (profile as any)?.status ?? (profile as any)?.Status ?? null;
  
  return {
    accountId: input.accountId ?? input.AccountID ?? 0,
    username: input.username ?? input.Username ?? "",
    email: input.email ?? input.Email ?? null,
    role: (input.role ?? input.Role ?? "STUDENT") as Account["role"],
    profile: profile || resolvedFullName
      ? {
          profileId: resolvedProfileId,
          fullName: resolvedFullName,
          email: input.email ?? input.Email ?? null,
          avatar: resolvedAvatar,
          status: resolvedStatus,
        }
      : null,
  };
}

export function getAccountListUrl(params: GetAccountListParams = {}): string {
  return `/accounts${buildQuery(params)}`;
}

export async function getAccountList(
  params: GetAccountListParams = {},
): Promise<PaginatedData<Account>> {
  const res = await apiClient.get<BackendAccount[]>(getAccountListUrl(params));
  return {
    items: (res.data ?? []).map(mapAccountFromBackend),
    meta: (res as typeof res & { meta?: PaginatedData<Account>["meta"] }).meta ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      total: 0,
    },
  };
}


export async function getAccountDetail(accountId: number): Promise<Account> {
  const res = await apiClient.get<BackendAccount>(`/accounts/${accountId}`);
  return mapAccountFromBackend(res.data as BackendAccount);
}

export async function getMyAccount(): Promise<Account> {
  const res = await apiClient.get<BackendAccount>("/accounts/me");
  return mapAccountFromBackend(res.data as BackendAccount);
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  const res = await apiClient.post<BackendAccount>("/accounts", input);
  return mapAccountFromBackend(res.data as BackendAccount);
}

export async function updateAccount(
  accountId: number,
  input: UpdateAccountInput,
): Promise<Account> {
  const res = await apiClient.put<BackendAccount>(`/accounts/${accountId}`, input);
  return mapAccountFromBackend(res.data as BackendAccount);
}

export async function deleteAccount(accountId: number): Promise<null> {
  await apiClient.delete(`/accounts/${accountId}`);
  return null;
}
