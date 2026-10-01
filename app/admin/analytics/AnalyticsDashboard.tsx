"use client";

import { FormEvent, useState } from "react";
import styles from "./analytics.module.css";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    if (!password || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/.netlify/functions/analytics-admin", {
        headers: { "x-admin-password": password },
        cache: "no-store",
      });

      if (!response.ok) {
        setError(response.status === 401 ? "Wrong password." : "Could not load analytics.");
        return;
      }

      setData((await response.json()) as AnalyticsResponse);
      setPassword("");
    } catch {
      setError("Could not connect to the analytics function.");
    } finally {
      setLoading(false);
    }
  }

  if (!data) {
    return (
      <main className={styles.page}>
        <form className={styles.loginCard} onSubmit={unlock}>
          <div className={styles.mark}>VT</div>
          <span className={styles.eyebrow}>PRIVATE ANALYTICS</span>
          <h1>Portfolio traffic</h1>
          <p>Enter your admin password to view private visitor statistics.</p>
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
          <a href="/">← Back to portfolio</a>
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
            <p>Updated {new Date(data.generatedAt).toLocaleString()}</p>
          </div>
          <button className={styles.lockButton} onClick={() => setData(null)}>Lock</button>
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
