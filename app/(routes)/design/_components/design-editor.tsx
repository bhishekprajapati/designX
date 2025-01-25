"use client";

import { useState } from "react";
import { Canvas } from "fabric";
import { Eye, EyeOff } from "lucide-react";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import initialStorage from "@/constants/initial.storage";

import ToolProvider from "@/contexts/tool-provider";
import useCanvas from "@/hooks/use-canvas";
import FabricCanvas from "@/components/fabric-canvas";
import CanvasProvider from "@/contexts/canvas-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import Tools from "./tools";
import { PresenceCursors } from "./presence";
import ControlPanel from "./control-panel";
import { EditorLayout } from "./editor-layout";

type LayersProps = {
  canvas: Canvas;
};

const Layers = ({}: LayersProps) => {
  const layers = useStorage(({ fabricCanvas }) => fabricCanvas.layers);

  const updateVisibility = useMutation(
    ({ storage }, id: string, visible: boolean) => {
      storage
        .get("fabricCanvas")
        .get("layers")
        .find((layer) => layer.get("id") === id)
        ?.update({
          visible,
        });
    },
    [layers]
  );

  return (
    <div className="p-4">
      <h4 className="mb-4 text-sm font-semibold leading-none">Layers</h4>
      <ul>
        {layers.map((layer) => (
          <li
            key={layer.id}
            className={cn("ps-4 pe-2 rounded-sm flex items-center gap-4", {
              "bg-gray-100 dark:bg-slate-900": false,
            })}
          >
            {layer.name}
            <Button
              className="ms-auto"
              variant="ghost"
              size="icon"
              onClick={() => updateVisibility(layer.id, !layer.visible)}
            >
              {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AssetsPanel = () => {
  const canvas = useCanvas();
  const background = useStorage(({ fabricCanvas }) => fabricCanvas.background);
  const [color, setColor] = useState(background);
  const sync = useMutation(
    ({ storage }) => {
      console.log("changing to", color);
      const fabric = storage.get("fabricCanvas");
      fabric.update({
        background: color,
      });
    },
    [color]
  );

  if (!canvas) return <></>;

  return (
    <div>
      <input
        type="color"
        onChange={(e) => {
          setColor(e.target.value);
          sync();
        }}
      />
      <Layers canvas={canvas} />
    </div>
  );
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
