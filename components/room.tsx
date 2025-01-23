"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import initialStorage from "@/constants/initial.storage";

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={process.env["NEXT_PUBLIC_LIVEBLOCK_PK"] ?? ""}
      throttle={16}
    >
      <RoomProvider
        id="my-room"
        initialPresence={{ cursor: { x: 0, y: 0 } }}
        initialStorage={initialStorage}
        autoConnect
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
