import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";

const STORE_NAME = "portfolio-analytics-v1";
const VIEW_PREFIX = "views/";

export type ViewRecord = {
  id: string;
  timestamp: string;
  path: string;
  visitorHash: string;
  country: string;
  device: "Desktop" | "Mobile" | "Tablet" | "Other";
  browser: string;
  referrerHost: string;
};

export type RankedItem = { label: string; count: number };

export type AnalyticsSummary = {
  period: string;
  totalViews: number;
  uniqueVisitors: number;
  topPages: RankedItem[];
  topCountries: RankedItem[];
  devices: RankedItem[];
  browsers: RankedItem[];
  daily: Array<{ date: string; views: number }>;
};

function analyticsStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export function monthKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function previousMonthKey(date = new Date()) {
  return monthKey(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1)));
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function normalizePath(value: unknown) {
  if (typeof value !== "string") return "/";
  const cleaned = value.trim().slice(0, 180);
  return cleaned.startsWith("/") && !cleaned.startsWith("//") ? cleaned : "/";
}

export function hashVisitor(value: unknown) {
  const raw = typeof value === "string" ? value.slice(0, 160) : "anonymous";
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

export function referrerHost(value: unknown) {
  if (typeof value !== "string" || !value) return "Direct";
  try {
    return new URL(value).hostname.replace(/^www\./, "") || "Direct";
  } catch {
    return "Direct";
  }
}

export function deviceFromUserAgent(userAgent: string): ViewRecord["device"] {
  if (/ipad|tablet|kindle|silk/i.test(userAgent)) return "Tablet";
  if (/mobile|iphone|ipod|android/i.test(userAgent)) return "Mobile";
  if (/windows|macintosh|linux|cros/i.test(userAgent)) return "Desktop";
  return "Other";
}

export function browserFromUserAgent(userAgent: string) {
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/opr\//i.test(userAgent)) return "Opera";
  if (/firefox\//i.test(userAgent)) return "Firefox";
  if (/chrome\//i.test(userAgent) && !/edg\//i.test(userAgent)) return "Chrome";
  if (/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent)) return "Safari";
  return "Other";
}

export function isBot(userAgent: string) {
  return /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|headless|lighthouse|pagespeed/i.test(userAgent);
}

export async function saveView(record: ViewRecord) {
  const store = analyticsStore();
  const month = record.timestamp.slice(0, 7);
  const key = `${VIEW_PREFIX}${month}/${record.timestamp.replace(/[:.]/g, "-")}-${record.id}.json`;
  await store.setJSON(key, record);
}

async function listKeys(prefix: string) {
  const store = analyticsStore();
  const keys: string[] = [];

  for await (const page of store.list({ prefix, paginate: true })) {
    for (const blob of page.blobs) keys.push(blob.key);
  }

  return keys;
}

async function loadKeys(keys: string[]) {
  const store = analyticsStore();
  const records: ViewRecord[] = [];
  const chunkSize = 60;

  for (let i = 0; i < keys.length; i += chunkSize) {
    const chunk = keys.slice(i, i + chunkSize);
    const values = await Promise.all(
      chunk.map((key) => store.get(key, { type: "json", consistency: "strong" }))
    );

    for (const value of values) {
      if (value && typeof value === "object") records.push(value as ViewRecord);
    }
  }

  return records;
}

export async function getViews(month?: string) {
  const prefix = month ? `${VIEW_PREFIX}${month}/` : VIEW_PREFIX;
  return loadKeys(await listKeys(prefix));
}

function rank(records: ViewRecord[], selector: (record: ViewRecord) => string, limit = 8) {
  const counts = new Map<string, number>();
  for (const record of records) {
    const label = selector(record) || "Unknown";
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export function summarize(records: ViewRecord[], period: string): AnalyticsSummary {
  const uniqueVisitors = new Set(records.map((record) => record.visitorHash)).size;
  const dailyMap = new Map<string, number>();

  for (const record of records) {
    const date = record.timestamp.slice(0, 10);
    dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
  }

  return {
    period,
    totalViews: records.length,
    uniqueVisitors,
    topPages: rank(records, (record) => record.path),
    topCountries: rank(records, (record) => record.country),
    devices: rank(records, (record) => record.device),
    browsers: rank(records, (record) => record.browser),
    daily: [...dailyMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, views]) => ({ date, views })),
  };
}
