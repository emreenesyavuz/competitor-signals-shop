import { CAPIPayload } from "@/types";
import { createHash } from "crypto";

const AD_ACCOUNT_ID = process.env.REDDIT_AD_ACCOUNT_ID;
const ACCESS_TOKEN = process.env.REDDIT_ACCESS_TOKEN;
const PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID;

function sha256(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function mapEventName(eventName: string): string {
  const map: Record<string, string> = {
    PageView: "PageVisit",
    ViewContent: "ViewContent",
    AddToCart: "AddToCart",
    InitiateCheckout: "Lead",
    Purchase: "Purchase",
  };
  return map[eventName] || eventName;
}

function buildUserData(payload: CAPIPayload) {
  const ud: Record<string, unknown> = {};
  const user = payload.userData;

  if (user?.email) ud.em = sha256(user.email);

  if (payload.clientIpAddress) ud.client_ip_address = payload.clientIpAddress;
  if (payload.userAgent) ud.user_agent = payload.userAgent;

  return ud;
}

export async function sendRedditEvent(payload: CAPIPayload): Promise<void> {
  if (!AD_ACCOUNT_ID || !ACCESS_TOKEN || !PIXEL_ID) return;

  const url = `https://ads-api.reddit.com/api/v3/conversions/events/${AD_ACCOUNT_ID}`;

  const event: Record<string, unknown> = {
    event_at: new Date(payload.eventTime * 1000).toISOString(),
    event_type: {
      tracking_type: mapEventName(payload.eventName),
    },
    user: buildUserData(payload),
    event_metadata: {
      item_count: 0,
      currency: "USD",
      value_decimal: 0,
    },
  };

  if (payload.sourceUrl) {
    (event.event_metadata as Record<string, unknown>).page_url = payload.sourceUrl;
  }

  if (payload.customData) {
    const meta = event.event_metadata as Record<string, unknown>;
    if (payload.customData.value) meta.value_decimal = payload.customData.value;
    if (payload.customData.currency) meta.currency = payload.customData.currency;
    if (payload.customData.num_items) meta.item_count = payload.customData.num_items;
    if (payload.customData.content_ids) {
      meta.products = (payload.customData.content_ids as string[]).map(
        (id) => ({ id })
      );
    }
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      events: [event],
      test_mode: false,
      partner: "",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Reddit CAPI error ${response.status}: ${body}`);
  }
}
