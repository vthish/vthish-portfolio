"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./analytics.module.css";
import { useAdminAutoLock } from "@/lib/use-admin-auto-lock";
import { ADMIN_IDLE_MINUTES, ADMIN_SESSION_HOURS } from "@/lib/admin-session-config";

type RankedItem = { label: string; count: number };
type Summary = {
  period: string;
  totalViews: number;
  uniqueVisitors: number;
  topPages: RankedItem[];
  topCountries: RankedItem[];
  topReferrers: RankedItem[];
  devices: RankedItem[];
  browsers: RankedItem[];
  daily: Array<{ date: string; views: number }>;
};
type EventSummary = {
  period: string;
  totalEvents: number;
  uniqueVisitors: number;
  eventTypes: RankedItem[];
  targets: RankedItem[];
  pages: RankedItem[];
};
type PeriodKey = "allTime" | "currentYear" | "currentMonth" | "last30Days" | "last7Days" | "today";
type AnalyticsResponse = {
  generatedAt: string;
  periods: Record<PeriodKey, Summary>;
  eventPeriods: Record<PeriodKey, EventSummary>;
};

const periodLabels: Record<PeriodKey, string> = {
  allTime: "All time",
  currentYear: "This year",
  currentMonth: "This month",
  last30Days: "Last 30 days",
  last7Days: "Last 7 days",
  today: "Today",
};

const eventLabels: Record<string, string> = {
  cv_click: "CV clicks",
  whatsapp_click: "WhatsApp clicks",
  email_open: "Email form opens",
  email_sent: "Emails sent",
  call_click: "Call clicks",
  project_repository_click: "Project repository clicks",
  project_live_demo_click: "Project live demo clicks",
  certificate_click: "Certificate clicks",
  social_click: "Social link clicks",
};

function Metric({ label, value }: { label: string; value: number }) {
  return <div className={styles.metric}><span>{label}</span><strong>{value.toLocaleString()}</strong></div>;
}

function RankedList({ title, items, labelMap }: { title: string; items: RankedItem[]; labelMap?: Record<string, string> }) {
  return <section className={styles.panel}><h2>{title}</h2>{items.length ? <div className={styles.rows}>{items.map((item) => <div className={styles.row} key={`${title}-${item.label}`}><span>{labelMap?.[item.label] || item.label}</span><strong>{item.count.toLocaleString()}</strong></div>)}</div> : <p className={styles.empty}>No data yet.</p>}</section>;
}

export default function AnalyticsDashboard() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [period, setPeriod] = useState<PeriodKey>("allTime");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAnalytics() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/.netlify/functions/analytics-admin", { cache: "no-store", credentials: "same-origin" });
      if (response.status === 401) { setAuthenticated(false); setData(null); return; }
      if (!response.ok) throw new Error("Could not load analytics.");
      setData((await response.json()) as AnalyticsResponse); setAuthenticated(true);
    } catch { setError("Could not connect to the analytics function."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadAnalytics(); }, []);

  async function unlock(event: FormEvent) {
    event.preventDefault(); if (!password || loading) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("/.netlify/functions/admin-auth", { method: "POST", headers: { "content-type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ password }) });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload.error || (response.status === 401 ? "Wrong password." : "Could not sign in."));
        return;
      }
      setPassword(""); await loadAnalytics();
    } catch { setError("Could not connect to the admin service."); }
    finally { setLoading(false); }
  }

  async function lock() {
    await fetch("/.netlify/functions/admin-auth", { method: "DELETE", credentials: "same-origin" }).catch(() => undefined);
    setAuthenticated(false); setData(null);
  }

  useAdminAutoLock(Boolean(authenticated), () => {
    setAuthenticated(false); setData(null);
    setError(`Admin session locked after ${ADMIN_IDLE_MINUTES} minutes of inactivity or when the secure session expired.`);
  });

  const selected = useMemo(() => data ? data.periods[period] : null, [data, period]);
  const selectedEvents = useMemo(() => data ? data.eventPeriods[period] : null, [data, period]);

  if (loading && authenticated === null) return <main className={styles.page}><div className={styles.empty}>Loading admin…</div></main>;
  if (!authenticated || !data || !selected || !selectedEvents) {
    return <main className={styles.page}><form className={styles.loginCard} onSubmit={unlock}><div className={styles.mark}>VT</div><span className={styles.eyebrow}>PRIVATE ADMIN</span><h1>Portfolio analytics</h1><p>Enter your admin password. The same session also unlocks portfolio content management. <strong>Auto-lock: {ADMIN_IDLE_MINUTES} min inactivity · {ADMIN_SESSION_HOURS}h max.</strong></p><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" autoComplete="current-password" autoFocus/><button type="submit" disabled={loading}>{loading ? "Loading…" : "Open dashboard"}</button>{error ? <div className={styles.error}>{error}</div> : null}<div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 16 }}><a href="/admin/content">Content manager</a><a href="/">Portfolio</a></div></form></main>;
  }

  return <main className={styles.page}><div className={styles.dashboard}>
    <header className={styles.header}><div><span className={styles.eyebrow}>VTHISH.DEV · PRIVATE</span><h1>Portfolio analytics</h1><p>Updated {new Date(data.generatedAt).toLocaleString()} · Auto-lock {ADMIN_IDLE_MINUTES} min idle · {ADMIN_SESSION_HOURS}h max</p></div><div className={styles.headerTools}><label>Period<select value={period} onChange={(event) => setPeriod(event.target.value as PeriodKey)}>{(Object.keys(periodLabels) as PeriodKey[]).map((key) => <option value={key} key={key}>{periodLabels[key]}</option>)}</select></label><a className={styles.lockButton} href="/admin/content">Manage content</a><button className={styles.lockButton} onClick={lock}>Lock</button></div></header>

    <section className={styles.metrics}><Metric label={`${periodLabels[period]} views`} value={selected.totalViews}/><Metric label="Unique visitors" value={selected.uniqueVisitors}/><Metric label="Tracked interactions" value={selectedEvents.totalEvents}/><Metric label="Interacting visitors" value={selectedEvents.uniqueVisitors}/></section>

    <div className={styles.grid}>
      <RankedList title="Top pages" items={selected.topPages}/>
      <RankedList title="Referrers" items={selected.topReferrers}/>
      <RankedList title="Top countries" items={selected.topCountries}/>
      <RankedList title="Devices" items={selected.devices}/>
      <RankedList title="Browsers" items={selected.browsers}/>
      <RankedList title="Interaction events" items={selectedEvents.eventTypes} labelMap={eventLabels}/>
      <RankedList title="Top interaction targets" items={selectedEvents.targets}/>
      <RankedList title="Interaction pages" items={selectedEvents.pages}/>
    </div>

    <section className={styles.panel}><h2>{periodLabels[period]} · daily views</h2>{selected.daily.length ? <div className={styles.daily}>{selected.daily.map((item) => <div key={item.date}><span>{item.date}</span><strong>{item.views}</strong></div>)}</div> : <p className={styles.empty}>No data yet.</p>}</section>

    <p className={styles.note}>Unique visitors use a privacy-friendly browser ID. IP addresses are not stored as analytics visitor records. Interaction tracking covers CV, WhatsApp, email, call, project and social clicks.</p>
    <a className={styles.back} href="/">← Back to portfolio</a>
  </div></main>;
}
