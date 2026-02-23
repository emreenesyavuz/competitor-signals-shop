import { CAPIPayload } from "@/types";
import { sendMetaEvent } from "./meta";

/**
 * Fan-out: sends the event to all configured CAPI endpoints in parallel.
 * Each adapter silently skips if its env vars are not set.
 */
export async function fanOutCAPI(payload: CAPIPayload): Promise<void> {
  const results = await Promise.allSettled([
    sendMetaEvent(payload),
    // Future platforms will be added here:
    // sendTikTokEvent(payload),
    // sendSnapchatEvent(payload),
    // sendPinterestEvent(payload),
    // sendRedditEvent(payload),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[CAPI fan-out] One adapter failed:", result.reason);
    }
  }
}
