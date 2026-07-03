export function isAdminRequestAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.ADMIN_SECRET ?? process.env.CRON_SECRET;

  if (!secret) return process.env.NODE_ENV !== "production";

  return authHeader === `Bearer ${secret}`;
}
