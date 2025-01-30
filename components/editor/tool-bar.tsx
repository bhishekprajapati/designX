"use client";

import * as fabric from "fabric";
import { Circle, Hand, MousePointer2, Square } from "lucide-react";
import { nanoid } from "nanoid";
import { LiveList, LiveObject } from "@liveblocks/client";
import { useMutation } from "@liveblocks/react";

import { Button } from "@ui/button";
import { Card } from "@ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/tooltip";
import { useCanvas } from "@/hooks/use-fabric";
import useTools from "@/hooks/use-tools";
import { ICircleLayerData, IRectLayerData } from "@/liveblocks.config";

const MoveTool = () => {
  const tools = useTools();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tools.mode === "move" ? "default" : "ghost"}
            size="icon"
            onClick={() => tools.setMode("move")}
          >
            <MousePointer2 size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Move tool</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const HandTool = () => {
  const tools = useTools();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tools.mode === "hand" ? "default" : "ghost"}
            size="icon"
            onClick={() => tools.setMode("hand")}
          >
            <Hand size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hand Tool</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const RectShapeTool = () => {
  const canvas = useCanvas();

  const sync = useMutation(({ storage }, layer: IRectLayerData) => {
    const fabric = storage.get("fabricCanvas");
    const layers = fabric.get("layers");
    if (!layers) fabric.set("layers", new LiveList([]));
    layers.push(new LiveObject(layer));
  }, []);

  const create = () => {
    canvas.defaultCursor = "crosshair";
    canvas.once("mouse:down", ({ pointer }) => {
      const rect = new fabric.Rect({
        id: nanoid(),
        name: "Rectangle",
        top: pointer.y,
        left: pointer.x,
        width: 50,
        height: 50,
      });
      canvas.defaultCursor = "default";
      canvas.add(rect);
      canvas.renderAll();
      sync(rect.toJSON() as IRectLayerData);
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={create}>
            <Square size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Rectangle Shape Tool</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const CircleShapeTool = () => {
  const canvas = useCanvas();
  const sync = useMutation(({ storage }, layer: ICircleLayerData) => {
    const fabric = storage.get("fabricCanvas");
    const layers = fabric.get("layers");
    if (!layers) fabric.set("layers", new LiveList([]));
    layers.push(new LiveObject(layer));
  }, []);

  const create = () => {
    canvas.defaultCursor = "crosshair";
    canvas.once("mouse:down", ({ pointer }) => {
      const circle = new fabric.Circle({
        id: nanoid(),
        name: "Circle",
        top: pointer.y,
        left: pointer.x,
        radius: 50,
        fill: "black",
      });
      canvas.add(circle);
      canvas.setActiveObject(circle);
      canvas.defaultCursor = "default";
      sync(circle.toJSON() as ICircleLayerData);
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={create}>
            <Circle size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Circle Shape Tool</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ToolBar = () => {
  return (
    <Card className="flex gap-2 p-2 rounded-[var(--radius)]">
      <MoveTool />
      <HandTool />
      <RectShapeTool />
      <CircleShapeTool />
    </Card>
  );
};

export default ToolBar;
