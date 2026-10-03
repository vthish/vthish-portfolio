const VISITOR_KEY = "vthish:analytics:visitor:v1";

export function getVisitorId() {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export function trackPortfolioEvent(event: string, label = "", path?: string) {
  if (typeof window === "undefined") return;
  if (navigator.doNotTrack === "1") return;
  const payload = {
    event,
    label,
    path: path || window.location.pathname,
    visitorId: getVisitorId(),
    referrer: document.referrer || "",
  };
  void fetch("/.netlify/functions/analytics-event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
    cache: "no-store",
  }).catch(() => undefined);
}
