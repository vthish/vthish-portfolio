import { createHmac, timingSafeEqual } from "node:crypto";
import { ADMIN_SESSION_HOURS } from "../../lib/admin-session-config";

export const ADMIN_COOKIE_NAME = "vt_admin_session";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function configuredPassword() {
  return process.env.ANALYTICS_ADMIN_PASSWORD || "";
}

function signature(expiresAt: string, password: string) {
  return createHmac("sha256", password)
    .update(`vthish-admin:${expiresAt}`)
    .digest("base64url");
}

export function passwordMatches(candidate: string) {
  const password = configuredPassword();
  return Boolean(password && candidate && safeEqual(candidate, password));
}

export function createSessionToken() {
  const password = configuredPassword();
  if (!password) return "";
  const expiresAt = String(Date.now() + ADMIN_SESSION_HOURS * 60 * 60 * 1000);
  return `${expiresAt}.${signature(expiresAt, password)}`;
}

export function sessionCookie(token: string) {
  return `${ADMIN_COOKIE_NAME}=${token}; Path=/; Max-Age=${ADMIN_SESSION_HOURS * 60 * 60}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearSessionCookie() {
  return `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

function readCookie(req: Request) {
  const cookies = req.headers.get("cookie") || "";
  for (const part of cookies.split(";")) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === ADMIN_COOKIE_NAME) return rest.join("=");
  }
  return "";
}

function validSessionExpiry(token: string) {
  const password = configuredPassword();
  if (!password || !token) return null;
  const [expiresAt, mac] = token.split(".");
  if (!expiresAt || !mac || !/^\d+$/.test(expiresAt)) return null;
  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || expiry <= Date.now()) return null;
  if (!safeEqual(mac, signature(expiresAt, password))) return null;
  return expiry;
}

export function adminSessionExpiry(req: Request) {
  return validSessionExpiry(readCookie(req));
}

export function isAdminAuthorized(req: Request) {
  // Protected admin endpoints accept only the signed HttpOnly session cookie.
  // Keeping raw-password header auth would create a brute-force path that bypasses
  // the login throttle in admin-auth.mts.
  return Boolean(adminSessionExpiry(req));
}
