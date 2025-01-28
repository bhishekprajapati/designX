"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import initialStorage from "@/constants/initial.storage";
import { useNetworkState } from "@uidotdev/usehooks";

import ToolProvider from "@/contexts/tool-provider";

import AssetsPanel from "./assets-panel";
import ControlPanel from "./control-panel";
import { EditorLayout } from "./editor-layout";
import { PresenceCursors } from "./presence";
import Tools from "./tools";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, X } from "lucide-react";
import FabricCanvasProvider from "@/contexts/fabric-provider";
import RenderLayers from "./render-layers";

const NotifyNetworkState = () => {
  const { online } = useNetworkState();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      const timer = setTimeout(() => {
        isFirstRender.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }

    toast(
      online ? (
        <span className="flex items-center gap-2">
          <CheckCircle2 className="fill-green-400 stroke-green-400 [&_path]:stroke-white" />
          Connected
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-red-400  inline-flex items-center justify-center p-1">
            <X size={16} />
          </span>
          Disconnected, Changes will be saved on re-connection!
        </span>
      )
    );
  }, [online]);

  return <></>;
};

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
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      throttle={100}
      preventUnsavedChanges
    >
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
      <FabricCanvasProvider options={{ selection: true }}>
        {({ ctx, fabricCanvas }) => (
          <ToolProvider>
            <EditorLayout>
              <EditorLayout.AssestPanel>
                {ctx && <AssetsPanel />}
              </EditorLayout.AssestPanel>
              <EditorLayout.Canvas>
                {fabricCanvas}
                {ctx && <RenderLayers />}
                <EditorLayout.Floating className="bottom-4 left-[50%] -translate-x-[50%]">
                  {ctx && <Tools />}
                </EditorLayout.Floating>
                {ctx && <PresenceCursors />}
              </EditorLayout.Canvas>
              <EditorLayout.ControlPanel>
                {ctx && <ControlPanel />}
              </EditorLayout.ControlPanel>
            </EditorLayout>
          </ToolProvider>
        )}
      </FabricCanvasProvider>
      <NotifyNetworkState />
    </DesignRoom>
  );
};

export default DesignEditor;
