"use client";

import { useEffect, useState } from "react";

import {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";

import { agoraClient } from "@/lib/agoraClient";

export default function VideoPage() {
  return (
    <AgoraRTCProvider client={agoraClient}>
      <VideoCall />
    </AgoraRTCProvider>
  );
}

function VideoCall() {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!;

  const channel = "test-room";

  const { isConnected } = useJoin(async () => {
    const res = await fetch(`/api/token?channel=${channel}`);

    const data = await res.json();

    return {
      appid: appId,
      channel,
      token: data.token,
      uid: data.uid,
    };
  }, true);

  /*
   * LOCAL TRACKS
   */
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isConnected);

  const { localCameraTrack } = useLocalCameraTrack(isConnected);

  /*
   * PUBLISH
   */
  usePublish(
    [localMicrophoneTrack, localCameraTrack],
    Boolean(isConnected && localMicrophoneTrack && localCameraTrack),
  );

  /*
   * REMOTE USERS
   */
  const remoteUsers = useRemoteUsers();

  return (
    <div className="h-screen bg-black text-white p-4">
      <h1 className="text-2xl mb-4">Agora Video Call</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* LOCAL */}
        <div className="aspect-video bg-zinc-900 rounded overflow-hidden">
          {localCameraTrack && (
            <LocalVideoTrack
              track={localCameraTrack}
              play
              className="w-full h-full"
            />
          )}
        </div>

        {/* REMOTE */}
        {remoteUsers.map((user) => (
          <div
            key={user.uid}
            className="aspect-video bg-zinc-900 rounded overflow-hidden"
          >
            <RemoteUser user={user} />
          </div>
        ))}
      </div>
    </div>
  );
}
