import { NextRequest, NextResponse } from "next/server";
import { CAPIPayload } from "@/types";
import { fanOutCAPI } from "@/lib/capi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const payload: CAPIPayload = {
      eventName: body.eventName,
      eventId: body.eventId,
      externalId: body.externalId,
      eventTime: body.eventTime || Math.floor(Date.now() / 1000),
      sourceUrl: body.sourceUrl || "",
      userData: body.userData,
      customData: body.customData,
      userAgent:
        body.userAgent || request.headers.get("user-agent") || "",
      clientIpAddress:
        body.clientIpAddress ||
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown",
    };

    await fanOutCAPI(payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CAPI route] Error:", error);
    return NextResponse.json(
      { error: "Failed to process event" },
      { status: 500 }
    );
  }
}
