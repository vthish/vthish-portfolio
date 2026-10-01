import type { Context } from "@netlify/functions";
import {
  browserFromUserAgent,
  deviceFromUserAgent,
  hashVisitor,
  isBot,
  normalizePath,
  referrerHost,
  saveView,
} from "../lib/analytics";

const allowedHosts = new Set(["vthish.dev", "www.vthish.dev", "localhost", "127.0.0.1"]);

function originAllowed(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  try {
    const host = new URL(origin).hostname;
    return allowedHosts.has(host) || host.endsWith(".netlify.app");
  } catch {
    return false;
  }
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!originAllowed(req)) return new Response("Forbidden", { status: 403 });
  if (req.headers.get("dnt") === "1") return new Response(null, { status: 204 });

  const userAgent = req.headers.get("user-agent") || "";
  if (isBot(userAgent)) return new Response(null, { status: 204 });

  let body: { path?: unknown; visitorId?: unknown; referrer?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const timestamp = new Date().toISOString();
  const id = crypto.randomUUID();

  await saveView({
    id,
    timestamp,
    path: normalizePath(body.path),
    visitorHash: hashVisitor(body.visitorId),
    country: context.geo?.country?.name || "Unknown",
    device: deviceFromUserAgent(userAgent),
    browser: browserFromUserAgent(userAgent),
    referrerHost: referrerHost(body.referrer),
  });

  return new Response(null, {
    status: 204,
    headers: { "cache-control": "no-store" },
  });
};
