"use client";

import { Canvas } from "fabric";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useMutation,
  useOthers,
  useStorage,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense";

import ToolBar from "./toolbar";
import { Button } from "./ui/button";
import { Room } from "./room";
import Cursor from "./cursor";
import ToolProvider from "@/contexts/tool-provider";
import useCanvas from "@/hooks/use-canvas";
import FabricCanvas from "@/components/fabric-canvas";
import { ModeToggle } from "@/components/mode-toggle";
import CanvasProvider from "@/contexts/canvas-provider";
import { cn } from "@/lib/utils";

type LayersProps = {
  canvas: Canvas;
};

const Layers = ({ canvas }: LayersProps) => {
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

const LeftBar = () => {
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

const RightBar = () => {
  return (
    <div>
      <ModeToggle />
    </div>
  );
};

const MyPresence = () => {
  const canvas = useCanvas();
  const update = useUpdateMyPresence();

  useEffect(() => {
    if (!canvas) return;
    canvas.on("mouse:move", ({ scenePoint }) =>
      update({
        cursor: {
          x: scenePoint.x,
          y: scenePoint.y,
        },
      })
    );
  }, [canvas]);

  return <></>;
};

const OthersPresence = () => {
  const COLORS = [
    "#E57373",
    "#9575CD",
    "#4FC3F7",
    "#81C784",
    "#FFF176",
    "#FF8A65",
    "#F06292",
    "#7986CB",
  ] as const;

  const others = useOthers();

  const getColor = (index: number) => {
    if (index < 0) return COLORS[0];
    if (index < COLORS.length) return COLORS[index];
    return COLORS[index % COLORS.length];
  };

  return (
    <ul className="flex items-center gap-4">
      {others.map(({ connectionId, presence }) => (
        <li key={connectionId}>
          {connectionId}
          {presence.cursor && (
            <Cursor
              x={presence.cursor.x}
              y={presence.cursor.y}
              color={getColor(connectionId)}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

const Design = () => {
  return (
    <Room>
      <CanvasProvider>
        <ToolProvider>
          <div className="w-full h-dvh">
            <div className="grid h-full grid-cols-[minmax(0,1fr)_5fr_minmax(0,1fr)]">
              <div className="col-span-3 p-4 border-b">
                <div className="flex items-center">
                  <OthersPresence />
                  <MyPresence />
                </div>
              </div>
              <LeftBar />
              <FabricCanvas options={{ selection: true }} className="h-full" />
              <RightBar />
              <div className="absolute bottom-4 left-[50%] -translate-x-[50%]">
                <ToolBar />
              </div>
            </div>
          </div>
        </ToolProvider>
      </CanvasProvider>
    </Room>
  );
};

export default Design;
