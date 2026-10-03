import type { Config } from "@netlify/functions";
import { Resend } from "resend";
import { getEvents, getViews, previousMonthKey, summarize, summarizeEvents } from "../lib/analytics";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function rows(items: Array<{ label: string; count: number }>) {
  if (!items.length) return '<tr><td style="padding:8px 0;color:#8490a6">No data yet</td><td></td></tr>';
  return items
    .slice(0, 5)
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;color:#dbe5f8">${escapeHtml(item.label)}</td><td style="padding:8px 0;text-align:right;color:#8eb7ff;font-weight:700">${item.count}</td></tr>`
    )
    .join("");
}

export default async () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

  const period = previousMonthKey(new Date());
  const [records, eventRecords] = await Promise.all([getViews(period), getEvents(period)]);
  const stats = summarize(records, period);
  const interactions = summarizeEvents(eventRecords, period);
  const resend = new Resend(apiKey);

  const to = process.env.ANALYTICS_EMAIL_TO || "devthish17@gmail.com";
  const from = process.env.ANALYTICS_EMAIL_FROM || "Portfolio Analytics <analytics@vthish.dev>";

  const html = `
    <div style="margin:0;background:#05070d;padding:32px;font-family:Inter,Arial,sans-serif;color:#f5f8ff">
      <div style="max-width:620px;margin:auto;border:1px solid #1d2a44;border-radius:20px;background:#0a0f1b;padding:28px">
        <div style="font-size:12px;letter-spacing:.16em;color:#77a8ff;font-weight:800">VTHISH.DEV · MONTHLY ANALYTICS</div>
        <h1 style="font-size:30px;margin:10px 0 4px">${escapeHtml(period)} report</h1>
        <p style="margin:0 0 24px;color:#8f9bb0">Private portfolio traffic summary.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:26px">
          <div style="flex:1;min-width:180px;border:1px solid #1d2a44;border-radius:14px;padding:18px"><div style="color:#8390a7;font-size:12px">PAGE VIEWS</div><div style="font-size:34px;font-weight:800;margin-top:5px">${stats.totalViews}</div></div>
          <div style="flex:1;min-width:180px;border:1px solid #1d2a44;border-radius:14px;padding:18px"><div style="color:#8390a7;font-size:12px">UNIQUE BROWSERS</div><div style="font-size:34px;font-weight:800;margin-top:5px">${stats.uniqueVisitors}</div></div>
          <div style="flex:1;min-width:180px;border:1px solid #1d2a44;border-radius:14px;padding:18px"><div style="color:#8390a7;font-size:12px">INTERACTIONS</div><div style="font-size:34px;font-weight:800;margin-top:5px">${interactions.totalEvents}</div></div>
        </div>
        <h2 style="font-size:16px;margin:0 0 6px">Top pages</h2>
        <table style="width:100%;border-collapse:collapse">${rows(stats.topPages)}</table>
        <h2 style="font-size:16px;margin:22px 0 6px">Top referrers</h2>
        <table style="width:100%;border-collapse:collapse">${rows(stats.topReferrers)}</table>
        <h2 style="font-size:16px;margin:22px 0 6px">Top countries</h2>
        <table style="width:100%;border-collapse:collapse">${rows(stats.topCountries)}</table>
        <h2 style="font-size:16px;margin:22px 0 6px">Interaction events</h2>
        <table style="width:100%;border-collapse:collapse">${rows(interactions.eventTypes)}</table>
        <p style="margin:26px 0 0;color:#667289;font-size:12px;line-height:1.6">Unique visitors are privacy-friendly browser IDs, not personally identified people. Bots are filtered where detectable.</p>
      </div>
    </div>`;

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `vthish.dev analytics — ${period}`,
    html,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
};

export const config: Config = {
  schedule: "5 0 1 * *",
};
