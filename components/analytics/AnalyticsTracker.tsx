"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const VISITOR_KEY = "vthish:analytics:visitor:v1";

function getVisitorId() {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;

    const id =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

    window.localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastTrackedPath.current === pathname) return;
    if (navigator.doNotTrack === "1") return;

    lastTrackedPath.current = pathname;

    const payload = {
      path: pathname,
      visitorId: getVisitorId(),
      referrer: document.referrer || "",
    };

    void fetch("/.netlify/functions/analytics-track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      cache: "no-store",
    }).catch(() => {
      // Analytics must never interrupt the public portfolio experience.
    });
  }, [pathname]);

  return null;
}
