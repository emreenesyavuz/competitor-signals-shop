"use client";

import { useTrackPageView } from "@/lib/useTrackPageView";

export default function TrackPageView({
  extraEvent,
}: {
  extraEvent?: { eventName: string; data?: Record<string, unknown> };
}) {
  useTrackPageView(extraEvent);
  return null;
}
