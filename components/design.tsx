"use client";

import FabricCanvas from "@/components/fabric-canvas";
import { ModeToggle } from "@/components/mode-toggle";
import CanvasProvider from "@/contexts/canvas-provider";
import ToolProvider from "@/contexts/tool-provider";
import ToolBar from "./toolbar";
import useCanvas from "@/hooks/use-canvas";
import { Canvas } from "fabric";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type LayersProps = {
  canvas: Canvas;
};

const Layers = ({ canvas }: LayersProps) => {
  type Layer = ArrayType<ReturnType<typeof canvas.getObjects>>;

  const [layers, setLayers] = useState<Layer[]>([]);

  const toggleVisibility = (layer: Layer) => {
    if (layer.visible) {
      layer.visible = false;
      canvas.discardActiveObject();
    } else {
      layer.visible = true;
      canvas.setActiveObject(layer);
    }

    canvas.renderAll();
  };

  useEffect(() => {
    const refresh = () => setLayers(canvas.getObjects());

    canvas.on("object:added", refresh);
    canvas.on("object:removed", refresh);

    return () => {
      canvas.off("object:added", refresh);
      canvas.off("object:removed", refresh);
    };
  }, [canvas]);

  return (
    <div className="p-4">
      <h4 className="mb-4 text-sm font-semibold leading-none">Layers</h4>
      <ul>
        {layers.map((layer) => (
          <li
            key={layer.id}
            className={cn("ps-4 pe-2 rounded-sm flex items-center gap-4", {
              "bg-slate-900": canvas.getActiveObject() === layer,
            })}
          >
            {layer.name}
            <Button
              className="ms-auto"
              variant="ghost"
              size="icon"
              onClick={() => toggleVisibility(layer)}
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
  if (!canvas) return <></>;

  return (
    <div>
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

const Design = () => {
  return (
    <CanvasProvider>
      <ToolProvider>
        <div className="w-full h-dvh">
          <div className="grid  h-full grid-rows-1 grid-cols-[minmax(0,1fr)_5fr_minmax(0,1fr)]">
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
  );
};

export default Design;
