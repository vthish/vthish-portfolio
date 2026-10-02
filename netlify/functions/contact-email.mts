import { getStore } from "@netlify/blobs";
import { Resend } from "resend";
import { getPortfolioContent } from "../lib/portfolio-content";

const RATE_STORE = "portfolio-contact-rate-v1";
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  }[character] || character));
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 180;
}

async function rateKey(req: Request) {
  const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = req.headers.get("user-agent") || "unknown";
  const bytes = new TextEncoder().encode(`${ip}|${ua}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

async function checkRateLimit(req: Request) {
  const store = getStore({ name: RATE_STORE, consistency: "strong" });
  const key = await rateKey(req);
  const now = Date.now();
  const record = await store.get(key, { type: "json", consistency: "strong" }) as { startedAt?: number; count?: number } | null;
  const startedAt = typeof record?.startedAt === "number" ? record.startedAt : now;
  const count = typeof record?.count === "number" ? record.count : 0;
  if (now - startedAt < WINDOW_MS && count >= MAX_PER_WINDOW) return false;
  const next = now - startedAt >= WINDOW_MS ? { startedAt: now, count: 1 } : { startedAt, count: count + 1 };
  await store.setJSON(key, next);
  return true;
}

function contactFromAddress() {
  const configured = process.env.CONTACT_EMAIL_FROM || process.env.ANALYTICS_EMAIL_FROM || "Portfolio Contact <analytics@vthish.dev>";
  const match = configured.match(/<([^>]+)>/);
  const email = match?.[1] || configured;
  return `vthish.dev Contact <${email}>`;
}

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    // Honeypot: real visitors never fill this hidden field.
    if (clean(body.website, 200)) return Response.json({ ok: true });

    const name = clean(body.name, 100);
    const email = clean(body.email, 180).toLowerCase();
    const subject = clean(body.subject, 180);
    const message = clean(body.message, 5000);

    if (!name || !validEmail(email) || !subject || message.length < 5) {
      return Response.json({ error: "Please enter your name, a valid email, subject and message." }, { status: 400 });
    }
    if (!(await checkRateLimit(req))) {
      return Response.json({ error: "Too many messages from this browser. Please try again later." }, { status: 429 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return Response.json({ error: "Email service is not configured." }, { status: 503 });

    const content = await getPortfolioContent();
    const to = content.identity.email || process.env.ANALYTICS_EMAIL_TO || "devthish17@gmail.com";
    const resend = new Resend(apiKey);
    const html = `
      <div style="margin:0;background:#05070d;padding:30px;font-family:Inter,Arial,sans-serif;color:#f5f8ff">
        <div style="max-width:640px;margin:auto;border:1px solid #1d2a44;border-radius:20px;background:#0a0f1b;padding:28px">
          <div style="font-size:11px;letter-spacing:.15em;color:#78a9ff;font-weight:800">VTHISH.DEV · PORTFOLIO MESSAGE</div>
          <h1 style="font-size:26px;margin:10px 0 20px">${escapeHtml(subject)}</h1>
          <table style="width:100%;border-collapse:collapse;margin-bottom:22px;color:#aab6ca;font-size:13px">
            <tr><td style="padding:7px 0;width:90px">From</td><td style="padding:7px 0;color:#eef4ff;font-weight:700">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:7px 0">Email</td><td style="padding:7px 0"><a href="mailto:${escapeHtml(email)}" style="color:#8eb7ff">${escapeHtml(email)}</a></td></tr>
          </table>
          <div style="white-space:pre-wrap;line-height:1.75;color:#d4def0;border-top:1px solid #1d2a44;padding-top:20px">${escapeHtml(message)}</div>
          <p style="margin:26px 0 0;color:#667289;font-size:11px">Sent from the contact form on vthish.dev. Replying to this email replies directly to the visitor.</p>
        </div>
      </div>`;

    const { error } = await resend.emails.send({
      from: contactFromAddress(),
      to,
      replyTo: email,
      subject: `[vthish.dev] ${subject}`,
      html,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) throw new Error(error.message);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send message.";
    return Response.json({ error: message }, { status: 500 });
  }
};
