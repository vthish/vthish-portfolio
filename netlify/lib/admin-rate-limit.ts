import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";

const STORE_NAME = "portfolio-admin-security-v1";
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

type AttemptRecord = {
  count: number;
  windowStartedAt: number;
  lockedUntil: number;
  updatedAt: string;
};

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

function clientFingerprint(req: Request) {
  const forwarded = req.headers.get("x-nf-client-connection-ip")
    || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  const userAgent = (req.headers.get("user-agent") || "unknown").slice(0, 300);
  return createHash("sha256").update(`${forwarded}|${userAgent}`).digest("hex").slice(0, 32);
}

function keyFor(req: Request) {
  return `login/${clientFingerprint(req)}.json`;
}

async function read(req: Request): Promise<AttemptRecord | null> {
  try {
    return await store().get(keyFor(req), { type: "json", consistency: "strong" }) as AttemptRecord | null;
  } catch {
    return null;
  }
}

export async function loginThrottle(req: Request) {
  const now = Date.now();
  const record = await read(req);
  if (!record) return { blocked: false, retryAfterSeconds: 0 };
  if (record.lockedUntil > now) {
    return { blocked: true, retryAfterSeconds: Math.max(1, Math.ceil((record.lockedUntil - now) / 1000)) };
  }
  return { blocked: false, retryAfterSeconds: 0 };
}

export async function recordLoginFailure(req: Request) {
  const now = Date.now();
  const existing = await read(req);
  const expiredWindow = !existing || now - existing.windowStartedAt > WINDOW_MS;
  const count = expiredWindow ? 1 : existing.count + 1;
  const lockedUntil = count >= MAX_FAILURES ? now + LOCK_MS : 0;
  const record: AttemptRecord = {
    count,
    windowStartedAt: expiredWindow ? now : existing.windowStartedAt,
    lockedUntil,
    updatedAt: new Date(now).toISOString(),
  };
  await store().setJSON(keyFor(req), record);
  return {
    remainingAttempts: Math.max(0, MAX_FAILURES - count),
    locked: lockedUntil > now,
    retryAfterSeconds: lockedUntil > now ? Math.ceil((lockedUntil - now) / 1000) : 0,
  };
}

export async function clearLoginFailures(req: Request) {
  try {
    await store().delete(keyFor(req));
  } catch {
    // Authentication success should not fail because cleanup had a transient error.
  }
}
