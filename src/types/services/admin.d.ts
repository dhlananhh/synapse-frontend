export type AdminUser = {
  id: string;
  accountId: string;
  username: string;
  email: string;
  role: "USER" | "SYSTEM_ADMIN";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  createdAt: string;
}
