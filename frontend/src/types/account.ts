export type Role = "ADMIN" | "LECTURER" | "STUDENT" | "PARENT";
export type ProfileStatus = "ACTIVE" | "INACTIVE" | "BANNED";

export interface AccountProfile {
  profileId: number;
  fullName: string | null;
  email: string | null;
  avatar: string | null;
  status: string | null;
}

export interface Account {
  accountId: number;
  username: string;
  email: string | null;
  role: Role;
  profile: AccountProfile | null;
}

export interface GetAccountListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  status?: ProfileStatus;
}

export interface CreateAccountInput {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateAccountInput {
  username?: string;
  email?: string;
  role?: Role;
  status?: ProfileStatus;
}

export interface DeleteAccountResult {
  accountId: number;
  username: string;
  email: string;
  role: Role;
  deleted: true;
  deletedAt: string;
}
