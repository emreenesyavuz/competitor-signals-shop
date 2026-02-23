import { CAPIPayload } from "@/types";
import { createHash } from "crypto";

const AD_ACCOUNT_ID = process.env.PINTEREST_AD_ACCOUNT_ID;
const ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN;

function sha256(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function mapEventName(eventName: string): string {
  const map: Record<string, string> = {
    PageView: "page_visit",
    ViewContent: "page_visit",
    AddToCart: "add_to_cart",
    InitiateCheckout: "checkout",
    Purchase: "checkout",
  };
  return map[eventName] || eventName;
}

function buildUserData(payload: CAPIPayload) {
  const ud: Record<string, unknown>[] = [];
  const user = payload.userData;

  if (user?.email) ud.push({ em: [sha256(user.email)] });
  else if (payload.clientIpAddress && payload.userAgent) {
    ud.push({
      client_ip_address: payload.clientIpAddress,
      client_user_agent: payload.userAgent,
    });
  }

  if (user?.phone) {
    if (ud.length > 0) {
      ud[0].ph = [sha256(user.phone)];
    }
  }
  if (user?.firstName && ud.length > 0) ud[0].fn = [sha256(user.firstName)];
  if (user?.lastName && ud.length > 0) ud[0].ln = [sha256(user.lastName)];
  if (user?.city && ud.length > 0) ud[0].ct = [sha256(user.city)];
  if (user?.state && ud.length > 0) ud[0].st = [sha256(user.state)];
  if (user?.zip && ud.length > 0) ud[0].zp = [sha256(user.zip)];
  if (user?.country && ud.length > 0) ud[0].country = [sha256(user.country)];

  if (payload.clientIpAddress && ud.length > 0) ud[0].client_ip_address = payload.clientIpAddress;
  if (payload.userAgent && ud.length > 0) ud[0].client_user_agent = payload.userAgent;

  return ud.length > 0 ? ud : [{ client_ip_address: payload.clientIpAddress, client_user_agent: payload.userAgent }];
}

export async function sendPinterestEvent(payload: CAPIPayload): Promise<void> {
  if (!AD_ACCOUNT_ID || !ACCESS_TOKEN) return;

  const url = `https://api.pinterest.com/v5/ad_accounts/${AD_ACCOUNT_ID}/events`;

  const event: Record<string, unknown> = {
    event_name: mapEventName(payload.eventName),
    action_source: "web",
    event_time: payload.eventTime,
    event_id: payload.eventId,
    event_source_url: payload.sourceUrl,
    user_data: buildUserData(payload)[0],
    language: "en",
  };

  if (payload.customData) {
    const customData: Record<string, unknown> = {};
    if (payload.customData.value) customData.value = String(payload.customData.value);
    if (payload.customData.currency) customData.currency = payload.customData.currency;
    if (payload.customData.num_items) customData.num_items = payload.customData.num_items;
    if (payload.customData.content_ids) {
      customData.content_ids = payload.customData.content_ids;
    }
    event.custom_data = customData;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ data: [event] }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Pinterest CAPI error ${response.status}: ${body}`);
  }
}
