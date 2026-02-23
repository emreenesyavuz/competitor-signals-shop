import { CAPIPayload } from "@/types";
import { sendMetaEvent } from "./meta";
import { sendTikTokEvent } from "./tiktok";
import { sendPinterestEvent } from "./pinterest";

/**
 * Fan-out: sends the event to all configured CAPI endpoints in parallel.
 * Each adapter silently skips if its env vars are not set.
 */
export async function fanOutCAPI(payload: CAPIPayload): Promise<void> {
  const results = await Promise.allSettled([
    sendMetaEvent(payload),
    sendTikTokEvent(payload),
    sendPinterestEvent(payload),
    // Future platforms will be added here:
    // sendSnapchatEvent(payload),
    // sendRedditEvent(payload),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[CAPI fan-out] One adapter failed:", result.reason);
    }
  }
}
