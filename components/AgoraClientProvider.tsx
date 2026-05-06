"use client";

import AgoraRTC from "agora-rtc-sdk-ng";
import { AgoraRTCProvider } from "agora-rtc-react";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

export default function AgoraClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AgoraRTCProvider client={client}>
      {children}
    </AgoraRTCProvider>
  );
}