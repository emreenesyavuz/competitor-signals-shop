"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "./tracking";

/**
 * Fires a PageView (and optionally a second event like ViewContent)
 * once per mount. Prevents double-firing in React strict mode.
 */
export function useTrackPageView(
  extraEvent?: {
    eventName: string;
    data?: Record<string, unknown>;
  }
) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    trackEvent({ eventName: "PageView" });

    if (extraEvent) {
      trackEvent({ eventName: extraEvent.eventName, data: extraEvent.data });
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps
}
