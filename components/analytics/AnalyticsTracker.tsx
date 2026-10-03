"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { getVisitorId } from "@/lib/analytics-client";

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
