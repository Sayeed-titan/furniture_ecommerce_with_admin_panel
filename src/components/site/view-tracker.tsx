"use client";

import { useEffect } from "react";

/** Fires a single best-effort view beacon for a product once per mount.
 * Uses `sendBeacon` so it survives navigation and never blocks the page. */
export function ViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    const payload = JSON.stringify({ productId });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track/view", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/track/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    } catch {
      // ignore — tracking is non-critical
    }
  }, [productId]);

  return null;
}
