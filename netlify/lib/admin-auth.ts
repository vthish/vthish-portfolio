import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE_NAME = "vt_admin_session";
const SESSION_HOURS = 12;

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
  const expiresAt = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  return `${expiresAt}.${signature(expiresAt, password)}`;
}

export function sessionCookie(token: string) {
  return `${ADMIN_COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_HOURS * 60 * 60}; HttpOnly; Secure; SameSite=Strict`;
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

function validSession(token: string) {
  const password = configuredPassword();
  if (!password || !token) return false;
  const [expiresAt, mac] = token.split(".");
  if (!expiresAt || !mac || !/^\d+$/.test(expiresAt)) return false;
  if (Number(expiresAt) <= Date.now()) return false;
  return safeEqual(mac, signature(expiresAt, password));
}

export function isAdminAuthorized(req: Request) {
  const suppliedPassword = req.headers.get("x-admin-password") || "";
  if (suppliedPassword && passwordMatches(suppliedPassword)) return true;
  return validSession(readCookie(req));
}
