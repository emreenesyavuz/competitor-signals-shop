"use client";

import { v4 as uuidv4 } from "uuid";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void };
    snaptr?: (...args: unknown[]) => void;
    pintrk?: (...args: unknown[]) => void;
    rdt?: (...args: unknown[]) => void;
  }
}

interface TrackingData {
  content_ids?: string[];
  content_name?: string;
  content_category?: string;
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  [key: string]: unknown;
}

interface TrackOptions {
  eventName: string;
  data?: TrackingData;
  userData?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

/**
 * Fires a conversion event to all configured pixels (client-side)
 * AND sends the same event to our CAPI endpoint (server-side).
 * A shared eventId is used for deduplication across client + server.
 */
export function trackEvent({ eventName, data, userData }: TrackOptions) {
  const eventId = uuidv4();

  trackPixels(eventName, eventId, data);
  sendCAPI(eventName, eventId, data, userData);
}

function trackPixels(
  eventName: string,
  eventId: string,
  data?: TrackingData
) {
  // Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, data, { eventID: eventId });
  }

  // TikTok Pixel (will be enabled in a future session)
  // if (typeof window !== "undefined" && window.ttq) { ... }

  // Snapchat Pixel (will be enabled in a future session)
  // if (typeof window !== "undefined" && window.snaptr) { ... }

  // Pinterest Tag (will be enabled in a future session)
  // if (typeof window !== "undefined" && window.pintrk) { ... }

  // Reddit Pixel (will be enabled in a future session)
  // if (typeof window !== "undefined" && window.rdt) { ... }
}

async function sendCAPI(
  eventName: string,
  eventId: string,
  data?: TrackingData,
  userData?: TrackOptions["userData"]
) {
  try {
    await fetch("/api/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        eventTime: Math.floor(Date.now() / 1000),
        sourceUrl: typeof window !== "undefined" ? window.location.href : "",
        userData,
        customData: data,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "",
      }),
    });
  } catch {
    // Silently fail -- CAPI errors should never block the user experience
  }
}
