import type { Context } from "@netlify/functions";
import {
  browserFromUserAgent,
  deviceFromUserAgent,
  hashVisitor,
  isBot,
  normalizePath,
  referrerHost,
  saveEvent,
} from "../lib/analytics";

const allowedHosts = new Set(["vthish.dev", "www.vthish.dev", "localhost", "127.0.0.1"]);
const allowedEvents = new Set([
  "cv_click",
  "whatsapp_click",
  "email_open",
  "email_sent",
  "call_click",
  "project_repository_click",
  "project_live_demo_click",
  "certificate_click",
  "social_click",
]);

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

function safeLabel(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 180) : "";
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!originAllowed(req)) return new Response("Forbidden", { status: 403 });
  if (req.headers.get("dnt") === "1") return new Response(null, { status: 204 });

  const userAgent = req.headers.get("user-agent") || "";
  if (isBot(userAgent)) return new Response(null, { status: 204 });

  let body: { event?: unknown; label?: unknown; path?: unknown; visitorId?: unknown; referrer?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const event = typeof body.event === "string" ? body.event.trim() : "";
  if (!allowedEvents.has(event)) return new Response("Invalid event", { status: 400 });

  await saveEvent({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    event,
    label: safeLabel(body.label),
    path: normalizePath(body.path),
    visitorHash: hashVisitor(body.visitorId),
    country: context.geo?.country?.name || "Unknown",
    device: deviceFromUserAgent(userAgent),
    browser: browserFromUserAgent(userAgent),
    referrerHost: referrerHost(body.referrer),
  });

  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
};
