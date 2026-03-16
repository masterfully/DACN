export {};

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        accountId: number;
        role: "ADMIN" | "LECTURER" | "STUDENT";
        username?: string;
      };
    }
  }
}
