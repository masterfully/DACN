export interface Student {
  profileId: number;
  accountId: number;
  role: "STUDENT";
  username: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  avatar: string | null;
  citizenId: string | null;
  hometown: string | null;
  status: string | null;
}
