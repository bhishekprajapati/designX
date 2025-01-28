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
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { CheckCircle2, X } from "lucide-react";
import FabricCanvasProvider from "@/contexts/fabric-provider";
import RenderLayers from "./render-layers";

import DisableZoom from "@/components/disable-zoom";
import { useCanvas } from "@/hooks/use-fabric";
import useTools from "@/hooks/use-tools";
import type { TPointerEvent, TPointerEventInfo } from "fabric";

const CanvasPanning = () => {
  const tools = useTools();
  const canvas = useCanvas();
  const isPanningRef = useRef(false);
  const lastPosX = useRef(0);
  const lastPosY = useRef(0);

  useEffect(() => {
    const handleModeChange = (ev: KeyboardEvent) => {
      if (ev.code === "Space") {
        tools.setMode("hand");
        const handleCleanUp = (ev: KeyboardEvent) => {
          if (ev.code === "Space") {
            tools.setMode("move");
            window.removeEventListener("keyup", handleCleanUp);
          }
        };
        window.addEventListener("keyup", handleCleanUp);
      }
    };
    window.addEventListener("keydown", handleModeChange);
    return () => {
      window.removeEventListener("keydown", handleModeChange);
    };
  }, [tools]);

  useEffect(() => {
    if (tools.mode !== "hand") return;

    type TEvent = TPointerEventInfo<TPointerEvent> & {
      e: { clientX: number; clientY: number };
    };

    const startPanning = function (ev: TEvent) {
      isPanningRef.current = true;
      canvas.selection = false;
      lastPosX.current = ev.e.clientX;
      lastPosY.current = ev.e.clientY;
    };

    const panning = (ev: TEvent) => {
      if (!isPanningRef.current) return;
      const deltaX = ev.e.clientX - lastPosX.current;
      const deltaY = ev.e.clientY - lastPosY.current;
      const vpt = canvas.viewportTransform;
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      canvas.requestRenderAll();
      lastPosX.current = ev.e.clientX;
      lastPosY.current = ev.e.clientY;
    };

    const stopPanning = () => {
      if (!isPanningRef.current) return;
      isPanningRef.current = false;
      canvas.selection = true;
      canvas.setViewportTransform(canvas.viewportTransform);
    };

    canvas.on("mouse:down", startPanning);
    canvas.on("mouse:move", panning);
    canvas.on("mouse:up", stopPanning);

    return () => {
      canvas.off("mouse:down", startPanning);
      canvas.off("mouse:move", panning);
      canvas.off("mouse:up", stopPanning);
    };
  }, [canvas, tools.mode]);

  return <></>;
};

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
                {ctx && (
                  <>
                    <RenderLayers />
                    <DisableZoom />
                    <CanvasPanning />
                  </>
                )}
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
