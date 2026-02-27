import { CAPIPayload } from "@/types";
import { createHash } from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const API_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function buildUserData(payload: CAPIPayload) {
  const ud: Record<string, unknown> = {};
  const user = payload.userData;

  if (user?.email) ud.em = [sha256(user.email)];
  if (user?.phone) ud.ph = [sha256(user.phone)];
  if (user?.firstName) ud.fn = [sha256(user.firstName)];
  if (user?.lastName) ud.ln = [sha256(user.lastName)];
  if (user?.city) ud.ct = [sha256(user.city)];
  if (user?.state) ud.st = [sha256(user.state)];
  if (user?.zip) ud.zp = [sha256(user.zip)];
  if (user?.country) ud.country = [sha256(user.country)];

  if (payload.externalId) ud.external_id = [sha256(payload.externalId)];
  if (payload.clientIpAddress) ud.client_ip_address = payload.clientIpAddress;
  if (payload.userAgent) ud.client_user_agent = payload.userAgent;
  if (payload.clickIds?.fbclid) {
    ud.fbc = `fb.1.${payload.eventTime * 1000}.${payload.clickIds.fbclid}`;
  }

  return ud;
}

export async function sendMetaEvent(payload: CAPIPayload): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) return;

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

  const event: Record<string, unknown> = {
    event_name: payload.eventName,
    event_time: payload.eventTime,
    event_id: payload.eventId,
    event_source_url: payload.sourceUrl,
    action_source: "website",
    user_data: buildUserData(payload),
  };

  if (payload.customData) {
    event.custom_data = payload.customData;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [event] }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Meta CAPI error ${response.status}: ${body}`);
  }
}
