import {
  adminSessionExpiry,
  clearSessionCookie,
  createSessionToken,
  passwordMatches,
  sessionCookie,
} from "../lib/admin-auth";
import { clearLoginFailures, loginThrottle, recordLoginFailure } from "../lib/admin-rate-limit";

export default async (req: Request) => {
  if (req.method === "GET") {
    const expiresAt = adminSessionExpiry(req);
    return Response.json(
      { authenticated: Boolean(expiresAt), expiresAt },
      { headers: { "cache-control": "no-store" } }
    );
  }

  if (req.method === "DELETE") {
    return Response.json(
      { authenticated: false },
      {
        headers: {
          "set-cookie": clearSessionCookie(),
          "cache-control": "no-store",
        },
      }
    );
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const throttle = await loginThrottle(req);
  if (throttle.blocked) {
    return Response.json(
      { error: `Too many failed attempts. Try again in ${Math.ceil(throttle.retryAfterSeconds / 60)} minute(s).`, retryAfterSeconds: throttle.retryAfterSeconds },
      { status: 429, headers: { "retry-after": String(throttle.retryAfterSeconds), "cache-control": "no-store" } }
    );
  }

  let body: { password?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!passwordMatches(password)) {
    const failure = await recordLoginFailure(req);
    if (failure.locked) {
      return Response.json(
        { error: "Too many failed attempts. Admin login is locked for 15 minutes.", retryAfterSeconds: failure.retryAfterSeconds },
        { status: 429, headers: { "retry-after": String(failure.retryAfterSeconds), "cache-control": "no-store" } }
      );
    }
    return Response.json(
      { error: `Wrong password. ${failure.remainingAttempts} attempt(s) remaining before temporary lock.` },
      { status: 401, headers: { "cache-control": "no-store" } }
    );
  }

  await clearLoginFailures(req);

  const token = createSessionToken();
  if (!token) {
    return Response.json({ error: "Admin password is not configured" }, { status: 500 });
  }

  return Response.json(
    { authenticated: true, expiresAt: Number(token.split(".")[0]) || null },
    {
      headers: {
        "set-cookie": sessionCookie(token),
        "cache-control": "no-store",
      },
    }
  );
};
