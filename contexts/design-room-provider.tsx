"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveList, LiveObject } from "@liveblocks/client";
import { nanoid } from "nanoid";

function DesignRoomProvider(props: {
  children: React.ReactNode;
  roomId: string;
}) {
  const { children, roomId } = props;

  const initialStorage: Liveblocks["Storage"] = {
    fabricCanvas: new LiveObject({
      name: "untitled",
      snapshot:
        "https://images.unsplash.com/photo-1612538498456-e861df91d4d0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=annie-spratt-BcGoZXjyPzA-unsplash.jpg&w=640",
      background: "gray",
      layers: new LiveList([]),
    }),
  };

  const initialPresence: Liveblocks["Presence"] = {
    cursor: { x: 0, y: 0 },
    randId: nanoid(5),
  };

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      throttle={100}
      preventUnsavedChanges
    >
      <RoomProvider
        id={roomId}
        initialPresence={initialPresence}
        initialStorage={initialStorage}
        autoConnect
      >
        <ClientSideSuspense fallback={<></>}>{children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

export default DesignRoomProvider;
