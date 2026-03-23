export interface Parent {
  accountId: number;
  role: "PARENT";
  username: string;
  fullName: string | null;
  email: string | null;
  profileId: number;
  avatar: string | null;
  status: string | null;
}
