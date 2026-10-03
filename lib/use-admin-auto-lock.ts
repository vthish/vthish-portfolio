"use client";

import { useEffect, useRef } from "react";
import { ADMIN_IDLE_MS } from "./admin-session-config";

type SessionStatus = {
  authenticated?: boolean;
  expiresAt?: number | null;
};

/**
 * Locks an authenticated admin page after inactivity and also mirrors the
 * server-side absolute cookie expiry in the UI. The server remains the source
 * of truth; this hook simply makes the lock visible immediately.
 */
export function useAdminAutoLock(active: boolean, onLocked: () => void) {
  const onLockedRef = useRef(onLocked);
  const lockingRef = useRef(false);

  useEffect(() => {
    onLockedRef.current = onLocked;
  }, [onLocked]);

  useEffect(() => {
    if (!active) return;

    let idleTimer: number | undefined;
    let absoluteTimer: number | undefined;
    let disposed = false;
    let lastActivity = Date.now();

    const clearTimers = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      if (absoluteTimer) window.clearTimeout(absoluteTimer);
    };

    const lockNow = async () => {
      if (lockingRef.current || disposed) return;
      lockingRef.current = true;
      clearTimers();
      try {
        await fetch("/.netlify/functions/admin-auth", {
          method: "DELETE",
          credentials: "same-origin",
          cache: "no-store",
        });
      } catch {
        // The UI still locks even if the network request fails. The signed
        // server token also has its own hard expiry.
      } finally {
        if (!disposed) onLockedRef.current();
        lockingRef.current = false;
      }
    };

    const armIdleTimer = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      const remaining = Math.max(0, ADMIN_IDLE_MS - (Date.now() - lastActivity));
      idleTimer = window.setTimeout(() => { void lockNow(); }, remaining);
    };

    const noteActivity = () => {
      if (lockingRef.current) return;
      lastActivity = Date.now();
      armIdleTimer();
    };

    const syncAbsoluteExpiry = async () => {
      try {
        const response = await fetch("/.netlify/functions/admin-auth", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });
        const status = await response.json() as SessionStatus;
        if (!response.ok || !status.authenticated) {
          void lockNow();
          return;
        }
        if (typeof status.expiresAt === "number") {
          const remaining = status.expiresAt - Date.now();
          if (remaining <= 0) {
            void lockNow();
            return;
          }
          if (absoluteTimer) window.clearTimeout(absoluteTimer);
          absoluteTimer = window.setTimeout(() => { void lockNow(); }, remaining + 150);
        }
      } catch {
        // Do not throw the user out because of a transient status-check error.
        // Protected API calls will still enforce the signed session server-side.
      }
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastActivity >= ADMIN_IDLE_MS) {
        void lockNow();
      } else {
        armIdleTimer();
        void syncAbsoluteExpiry();
      }
    };

    const activityEvents: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, noteActivity, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);

    armIdleTimer();
    void syncAbsoluteExpiry();

    return () => {
      disposed = true;
      clearTimers();
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, noteActivity));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);
}
