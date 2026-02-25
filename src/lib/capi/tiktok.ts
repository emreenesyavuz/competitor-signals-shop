import { CAPIPayload } from "@/types";
import { createHash } from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

function sha256(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function buildUserData(payload: CAPIPayload) {
  const ud: Record<string, unknown> = {};
  const user = payload.userData;

  if (user?.email) ud.email = sha256(user.email);
  if (user?.phone) ud.phone = sha256(user.phone);

  if (payload.externalId) ud.external_id = sha256(payload.externalId);
  if (payload.clientIpAddress) ud.ip = payload.clientIpAddress;
  if (payload.userAgent) ud.user_agent = payload.userAgent;

  return ud;
}

function mapEventName(eventName: string): string {
  const map: Record<string, string> = {
    PageView: "Pageview",
    ViewContent: "ViewContent",
    AddToCart: "AddToCart",
    InitiateCheckout: "InitiateCheckout",
    Purchase: "CompletePayment",
  };
  return map[eventName] || eventName;
}

export async function sendTikTokEvent(payload: CAPIPayload): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) return;

  const url = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

  const event: Record<string, unknown> = {
    event: mapEventName(payload.eventName),
    event_time: payload.eventTime,
    event_id: payload.eventId,
    user: buildUserData(payload),
    page: {
      url: payload.sourceUrl,
    },
  };

  if (payload.customData) {
    const properties: Record<string, unknown> = {};
    if (payload.customData.content_ids) {
      properties.contents = (payload.customData.content_ids as string[]).map(
        (id) => ({ content_id: id, content_type: "product" })
      );
    }
    if (payload.customData.value) properties.value = payload.customData.value;
    if (payload.customData.currency) properties.currency = payload.customData.currency;
    event.properties = properties;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({
      event_source: "web",
      event_source_id: PIXEL_ID,
      data: [event],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`TikTok Events API error ${response.status}: ${body}`);
  }
}
