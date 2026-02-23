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

function buildUserData(payload: CAPIPayload) {
  const ud: Record<string, unknown> = {};
  const user = payload.userData;

  if (user?.email) ud.em = sha256(user.email);

  if (payload.userAgent) ud.user_agent = payload.userAgent;

  return ud;
}

export async function sendRedditEvent(payload: CAPIPayload): Promise<void> {
  if (!ACCESS_TOKEN || !PIXEL_ID) return;

  const url = `https://ads-api.reddit.com/api/v3/pixels/${PIXEL_ID}/conversion_events`;

  const event: Record<string, unknown> = {
    event_at: payload.eventTime * 1000,
    action_source: "web",
    type: {
      tracking_type: mapEventName(payload.eventName),
    },
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
