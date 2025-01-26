"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import initialStorage from "@/constants/initial.storage";

import ToolProvider from "@/contexts/tool-provider";
import FabricCanvas from "@/components/fabric-canvas";
import CanvasProvider from "@/contexts/canvas-provider";

import AssetsPanel from "./assets-panel";
import ControlPanel from "./control-panel";
import { EditorLayout } from "./editor-layout";
import { PresenceCursors } from "./presence";
import Tools from "./tools";

type DesignRoomOptions = {
  id: string;
};

type DesignRoomProps = {
  children: React.ReactNode;
  room: DesignRoomOptions;
};

function DesignRoom(props: DesignRoomProps) {
  const { children, room } = props;

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16}>
      <RoomProvider
        id={room.id}
        initialPresence={{ cursor: { x: 0, y: 0 } }}
        initialStorage={initialStorage}
        autoConnect
      >
        <ClientSideSuspense fallback={<></>}>{children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

type DesignEditorProps = {
  room: DesignRoomOptions;
};

const DesignEditor = ({ room }: DesignEditorProps) => {
  return (
    <DesignRoom room={room}>
      <CanvasProvider>
        <ToolProvider>
          <EditorLayout>
            <EditorLayout.AssestPanel>
              <AssetsPanel />
            </EditorLayout.AssestPanel>
            <EditorLayout.Canvas>
              <FabricCanvas options={{ selection: true }} className="h-full" />
              <EditorLayout.Floating className="bottom-4 left-[50%] -translate-x-[50%]">
                <Tools />
              </EditorLayout.Floating>
              <PresenceCursors />
            </EditorLayout.Canvas>
            <EditorLayout.ControlPanel>
              <ControlPanel />
            </EditorLayout.ControlPanel>
          </EditorLayout>
        </ToolProvider>
      </CanvasProvider>
    </DesignRoom>
  );
};

export default DesignEditor;
