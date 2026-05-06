import { NextRequest, NextResponse } from "next/server";
import { RtcTokenBuilder, RtcRole } from "agora-token";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const channel = searchParams.get("channel");

  if (!channel) {
    return NextResponse.json({ error: "Channel missing" }, { status: 400 });
  }

  const appId = process.env.AGORA_APP_ID!;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE!;

  const uid = Math.floor(Math.random() * 100000);

  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600;

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const privilegeExpire = currentTimestamp + expirationTimeInSeconds;
  const tokenExpire = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channel,
    uid,
    role,
    tokenExpire,
    privilegeExpire,
  );

  return NextResponse.json({
    token,
    uid,
    channel,
  });
}
