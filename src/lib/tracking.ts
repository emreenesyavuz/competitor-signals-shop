"use client";

import { v4 as uuidv4 } from "uuid";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; identify: (data: Record<string, unknown>) => void };
    snaptr?: (...args: unknown[]) => void;
    pintrk?: (...args: unknown[]) => void;
    rdt?: (...args: unknown[]) => void;
  }
}

const EXTERNAL_ID_KEY = "signalshop_external_id";

function getExternalId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(EXTERNAL_ID_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(EXTERNAL_ID_KEY, id);
  }
  return id;
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
  const externalId = getExternalId();

  trackPixels(eventName, eventId, externalId, data);
  sendCAPI(eventName, eventId, externalId, data, userData);
}

function trackPixels(
  eventName: string,
  eventId: string,
  externalId: string,
  data?: TrackingData
) {
  // Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, data, {
      eventID: eventId,
      external_id: externalId,
    });
  }

  // TikTok Pixel
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.identify({ external_id: externalId });
    const tiktokEventMap: Record<string, string> = {
      PageView: "Pageview",
      ViewContent: "ViewContent",
      AddToCart: "AddToCart",
      InitiateCheckout: "InitiateCheckout",
      Purchase: "CompletePayment",
    };
    const ttEvent = tiktokEventMap[eventName] || eventName;
    window.ttq.track(ttEvent, { ...data, event_id: eventId });
  }

  // Snapchat Pixel
  if (typeof window !== "undefined" && window.snaptr) {
    const snapEventMap: Record<string, string> = {
      PageView: "PAGE_VIEW",
      ViewContent: "VIEW_CONTENT",
      AddToCart: "ADD_CART",
      InitiateCheckout: "START_CHECKOUT",
      Purchase: "PURCHASE",
    };
    const snapEvent = snapEventMap[eventName];
    if (snapEvent) {
      const snapData: Record<string, unknown> = {
        event_id: eventId,
        user_data: { external_id: externalId },
      };
      if (data?.value) snapData.price = data.value;
      if (data?.currency) snapData.currency = data.currency;
      if (data?.content_ids) snapData.item_ids = data.content_ids;
      if (data?.num_items) snapData.number_items = data.num_items;
      window.snaptr("track", snapEvent, snapData);
    }
  }

  // Pinterest Tag
  if (typeof window !== "undefined" && window.pintrk) {
    const pinterestEventMap: Record<string, string> = {
      PageView: "page",
      AddToCart: "addtocart",
      Purchase: "checkout",
    };
    const pinEvent = pinterestEventMap[eventName] || eventName;
    const pinData: Record<string, unknown> = { event_id: eventId };
    if (data?.value) pinData.value = data.value;
    if (data?.currency) pinData.order_quantity = data.num_items || 1;
    if (data?.currency) pinData.currency = data.currency;
    if (data?.content_ids) pinData.line_items = data.content_ids.map((id) => ({ product_id: id }));
    window.pintrk("track", pinEvent, pinData);
  }

  // Reddit Pixel
  if (typeof window !== "undefined" && window.rdt) {
    const redditEventMap: Record<string, string> = {
      PageView: "PageVisit",
      ViewContent: "ViewContent",
      AddToCart: "AddToCart",
      InitiateCheckout: "Lead",
      Purchase: "Purchase",
    };
    const rdtEvent = redditEventMap[eventName];
    if (rdtEvent) {
      const rdtData: Record<string, unknown> = {
        conversionId: eventId,
        externalId: externalId,
      };
      if (data?.value) rdtData.value = data.value;
      if (data?.currency) rdtData.currency = data.currency;
      if (data?.num_items) rdtData.itemCount = data.num_items;
      window.rdt("track", rdtEvent, rdtData);
    }
  }
}

async function sendCAPI(
  eventName: string,
  eventId: string,
  externalId: string,
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
        externalId,
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
