import { CAPIPayload } from "@/types";
import { createHash } from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;
const ACCESS_TOKEN = process.env.SNAP_ACCESS_TOKEN;

function sha256(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function mapEventName(eventName: string): string {
  const map: Record<string, string> = {
    PageView: "PAGE_VIEW",
    ViewContent: "VIEW_CONTENT",
    AddToCart: "ADD_CART",
    InitiateCheckout: "START_CHECKOUT",
    Purchase: "PURCHASE",
  };
  return map[eventName] || eventName;
}

function buildUserData(payload: CAPIPayload) {
  const ud: Record<string, unknown> = {};
  const user = payload.userData;

  if (user?.email) ud.em = [sha256(user.email)];
  if (user?.phone) ud.ph = [sha256(user.phone)];

  if (payload.externalId) ud.external_id = sha256(payload.externalId);
  if (payload.clientIpAddress) ud.client_ip_address = payload.clientIpAddress;
  if (payload.userAgent) ud.client_user_agent = payload.userAgent;
  if (payload.clickIds?.sclid) ud.sc_click_id = payload.clickIds.sclid;

  return ud;
}

export async function sendSnapchatEvent(payload: CAPIPayload): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) return;

  const url = `https://tr.snapchat.com/v3/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

  const event: Record<string, unknown> = {
    event_name: mapEventName(payload.eventName),
    event_time: payload.eventTime,
    event_id: payload.eventId,
    event_source_url: payload.sourceUrl,
    action_source: "WEB",
    user_data: buildUserData(payload),
  };

  if (payload.customData) {
    const customData: Record<string, unknown> = {};
    if (payload.customData.value) customData.value = String(payload.customData.value);
    if (payload.customData.currency) customData.currency = payload.customData.currency;
    if (payload.customData.content_ids) {
      customData.contents = (payload.customData.content_ids as string[]).map(
        (id) => ({ id, quantity: "1" })
      );
    }
    event.custom_data = customData;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [event] }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Snapchat CAPI error ${response.status}: ${body}`);
  }
}
