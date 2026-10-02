import {
  clearSessionCookie,
  createSessionToken,
  isAdminAuthorized,
  passwordMatches,
  sessionCookie,
} from "../lib/admin-auth";

export default async (req: Request) => {
  if (req.method === "GET") {
    return Response.json(
      { authenticated: isAdminAuthorized(req) },
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

  let body: { password?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!passwordMatches(password)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = createSessionToken();
  if (!token) {
    return Response.json({ error: "Admin password is not configured" }, { status: 500 });
  }

  return Response.json(
    { authenticated: true },
    {
      headers: {
        "set-cookie": sessionCookie(token),
        "cache-control": "no-store",
      },
    }
  );
};
