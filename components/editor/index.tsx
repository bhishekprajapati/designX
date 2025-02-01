"use client";

import type { FabricCanvasHydrationState } from "@/liveblocks.config";

import DesignRoomProvider from "@/contexts/design-room-provider";
import FabricCanvasProvider from "@/contexts/fabric-provider";
import ToolProvider from "@/contexts/tool-provider";

import DisableZoom from "@/components/disable-zoom";
import { PresenceCursors } from "@components/presence";

import CanvasPanning from "@editor/canvas/panning";
import { EditorLayout } from "@editor/layout";
import NetworkStateNotification from "@editor/notifications/network-state";
import AssetsPanel from "@editor/panels/assets";
import ControlPanel from "@editor/panels/controls";
import ToolBar from "@editor/tool-bar";
import TopBar from "@editor/top-bar";
import CanvasSnapshot from "./canvas/snapshot";

type DesignEditorProps = {
  room: {
    id: string;
  };
  initialCanvasState: FabricCanvasHydrationState;
};

const DesignEditor = (props: DesignEditorProps) => {
  const { room, initialCanvasState } = props;

  return (
    <DesignRoomProvider roomId={room.id}>
      <FabricCanvasProvider initialCanvasState={initialCanvasState}>
        {({ ctx, fabricCanvas }) => (
          <ToolProvider>
            <EditorLayout renderTopBar={() => <TopBar />}>
              <EditorLayout.AssestPanel>
                {ctx && <AssetsPanel />}
              </EditorLayout.AssestPanel>
              <EditorLayout.Canvas>
                {fabricCanvas}
                {ctx && (
                  <>
                    <DisableZoom />
                    <CanvasPanning />
                    <CanvasSnapshot />
                  </>
                )}
                <EditorLayout.Floating className="bottom-4 left-[50%] -translate-x-[50%]">
                  {ctx && <ToolBar />}
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
      <NetworkStateNotification />
    </DesignRoomProvider>
  );
};

export default DesignEditor;
