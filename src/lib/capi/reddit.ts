import { CAPIPayload } from "@/types";
import { createHash } from "crypto";

const ACCESS_TOKEN = process.env.REDDIT_ACCESS_TOKEN;
const PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID;

function sha256(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function generateConversionId(
  eventAt: number,
  trackingType: string,
  value: string,
  ipAddress: string
): string {
  const input = `${eventAt}${trackingType}${value}${ipAddress}`;
  return createHash("sha256").update(input).digest("hex");
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

export async function sendRedditEvent(payload: CAPIPayload): Promise<void> {
  if (!ACCESS_TOKEN || !PIXEL_ID) return;

  const url = `https://ads-api.reddit.com/api/v3/pixels/${PIXEL_ID}/conversion_events`;

  const trackingType = mapEventName(payload.eventName);
  const eventAtMs = payload.eventTime * 1000;
  const metaValue = String(payload.customData?.value || "");
  const ip = payload.clientIpAddress || "unknown";

  const user: Record<string, unknown> = {};
  if (payload.userData?.email) user.email = sha256(payload.userData.email);
  if (payload.clientIpAddress) user.ip_address = sha256(payload.clientIpAddress);
  if (payload.userAgent) user.user_agent = payload.userAgent;

  const metadata: Record<string, unknown> = {
    conversion_id: generateConversionId(eventAtMs, trackingType, metaValue, ip),
  };
  if (payload.customData?.value) metadata.value = payload.customData.value;
  if (payload.customData?.currency) metadata.currency = payload.customData.currency;
  if (payload.customData?.num_items) metadata.item_count = payload.customData.num_items;
  if (payload.customData?.content_ids) {
    metadata.products = (payload.customData.content_ids as string[]).map(
      (id) => ({ id })
    );
  }

  const event: Record<string, unknown> = {
    event_at: eventAtMs,
    action_source: "WEBSITE",
    type: {
      tracking_type: trackingType,
    },
    user,
    metadata,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        events: [event],
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Reddit CAPI error ${response.status}: ${body}`);
  }
}
