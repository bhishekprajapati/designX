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
import CanvasContextMenu from "./canvas/context-menu";
import { Alert, AlertDescription } from "../ui/alert";
import { Info } from "lucide-react";
import { WhenLargeScreen, WhenSmallScreen } from "../screens";

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
              <WhenLargeScreen>
                <EditorLayout.AssestPanel>
                  {ctx && <AssetsPanel />}
                </EditorLayout.AssestPanel>
              </WhenLargeScreen>
              <EditorLayout.Canvas>
                <CanvasContextMenu>{fabricCanvas}</CanvasContextMenu>
                {ctx && (
                  <>
                    <DisableZoom />
                    <CanvasPanning />
                    <CanvasSnapshot />
                  </>
                )}
                <EditorLayout.Floating className="bottom-4 left-[50%] -translate-x-[50%]">
                  {ctx && (
                    <>
                      <WhenSmallScreen>
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Open app on desktop to access editor
                          </AlertDescription>
                        </Alert>
                      </WhenSmallScreen>
                      <WhenLargeScreen>
                        <ToolBar />
                      </WhenLargeScreen>
                    </>
                  )}
                </EditorLayout.Floating>
                <WhenLargeScreen>{ctx && <PresenceCursors />}</WhenLargeScreen>
              </EditorLayout.Canvas>
              <WhenLargeScreen>
                <EditorLayout.ControlPanel>
                  {ctx && <ControlPanel />}
                </EditorLayout.ControlPanel>
              </WhenLargeScreen>
            </EditorLayout>
          </ToolProvider>
        )}
      </FabricCanvasProvider>
      <NetworkStateNotification />
    </DesignRoomProvider>
  );
};

export default DesignEditor;
