// Admin allowlist for MVP. Replace with role-based system later
// without changing the Admin UI.
export const ADMIN_ALLOWLIST: string[] = [
  "admin@gmail.com",
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_ALLOWLIST.includes(email.trim().toLowerCase());
}
