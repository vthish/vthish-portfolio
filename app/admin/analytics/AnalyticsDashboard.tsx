"use client";

import { FormEvent, useEffect, useState } from "react";
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
  devices: RankedItem[];
  browsers: RankedItem[];
  daily: Array<{ date: string; views: number }>;
};
type AnalyticsResponse = {
  generatedAt: string;
  allTime: Summary;
  currentMonth: Summary;
  today: Summary;
};

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong>{value.toLocaleString()}</strong>
    </div>
  );
}

function RankedList({ title, items }: { title: string; items: RankedItem[] }) {
  return (
    <section className={styles.panel}>
      <h2>{title}</h2>
      {items.length ? (
        <div className={styles.rows}>
          {items.map((item) => (
            <div className={styles.row} key={`${title}-${item.label}`}>
              <span>{item.label}</span>
              <strong>{item.count.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No data yet.</p>
      )}
    </section>
  );
}

export default function AnalyticsDashboard() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAnalytics() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/.netlify/functions/analytics-admin", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (response.status === 401) {
        setAuthenticated(false);
        setData(null);
        return;
      }
      if (!response.ok) throw new Error("Could not load analytics.");
      setData((await response.json()) as AnalyticsResponse);
      setAuthenticated(true);
    } catch {
      setError("Could not connect to the analytics function.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    if (!password || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/.netlify/functions/admin-auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError(response.status === 401 ? "Wrong password." : "Could not sign in.");
        return;
      }

      setPassword("");
      await loadAnalytics();
    } catch {
      setError("Could not connect to the admin service.");
    } finally {
      setLoading(false);
    }
  }

  async function lock() {
    await fetch("/.netlify/functions/admin-auth", {
      method: "DELETE",
      credentials: "same-origin",
    }).catch(() => undefined);
    setAuthenticated(false);
    setData(null);
  }

  useAdminAutoLock(Boolean(authenticated), () => {
    setAuthenticated(false);
    setData(null);
    setError(`Admin session locked after ${ADMIN_IDLE_MINUTES} minutes of inactivity or when the secure session expired.`);
  });

  if (loading && authenticated === null) {
    return <main className={styles.page}><div className={styles.empty}>Loading admin…</div></main>;
  }

  if (!authenticated || !data) {
    return (
      <main className={styles.page}>
        <form className={styles.loginCard} onSubmit={unlock}>
          <div className={styles.mark}>VT</div>
          <span className={styles.eyebrow}>PRIVATE ADMIN</span>
          <h1>Portfolio analytics</h1>
          <p>Enter your admin password. The same session also unlocks portfolio content management. <strong>Auto-lock: {ADMIN_IDLE_MINUTES} min inactivity · {ADMIN_SESSION_HOURS}h max.</strong></p>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
            autoComplete="current-password"
            autoFocus
          />
          <button type="submit" disabled={loading}>{loading ? "Loading…" : "Open dashboard"}</button>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 16 }}>
            <a href="/admin/content">Content manager</a>
            <a href="/">Portfolio</a>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>VTHISH.DEV · PRIVATE</span>
            <h1>Portfolio analytics</h1>
            <p>Updated {new Date(data.generatedAt).toLocaleString()} · Auto-lock {ADMIN_IDLE_MINUTES} min idle · {ADMIN_SESSION_HOURS}h max</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <a className={styles.lockButton} href="/admin/content">Manage content</a>
            <button className={styles.lockButton} onClick={lock}>Lock</button>
          </div>
        </header>

        <section className={styles.metrics}>
          <Metric label="All-time views" value={data.allTime.totalViews} />
          <Metric label="All-time unique" value={data.allTime.uniqueVisitors} />
          <Metric label="This month" value={data.currentMonth.totalViews} />
          <Metric label="Today" value={data.today.totalViews} />
        </section>

        <div className={styles.grid}>
          <RankedList title="Top pages" items={data.allTime.topPages} />
          <RankedList title="Top countries" items={data.allTime.topCountries} />
          <RankedList title="Devices" items={data.allTime.devices} />
          <RankedList title="Browsers" items={data.allTime.browsers} />
        </div>

        <section className={styles.panel}>
          <h2>This month · daily views</h2>
          {data.currentMonth.daily.length ? (
            <div className={styles.daily}>
              {data.currentMonth.daily.map((item) => (
                <div key={item.date}><span>{item.date}</span><strong>{item.views}</strong></div>
              ))}
            </div>
          ) : <p className={styles.empty}>No data yet.</p>}
        </section>

        <p className={styles.note}>Unique visitors use a privacy-friendly browser ID. IP addresses are not stored.</p>
        <a className={styles.back} href="/">← Back to portfolio</a>
      </div>
    </main>
  );
}
