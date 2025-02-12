"use client";

import * as fabric from "fabric";
import { Circle, Hand, Info, MousePointer2, Square, Type } from "lucide-react";
import { nanoid } from "nanoid";

import { Button } from "@ui/button";
import { Card } from "@ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/tooltip";
import { useCreateObject } from "@/hooks/use-fabric";
import useTools from "@/hooks/use-tools";

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
  const create = useCreateObject();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              create(
                ({ pointer }) =>
                  new fabric.Rect({
                    id: nanoid(),
                    name: "Rectangle",
                    top: pointer.y,
                    left: pointer.x,
                    width: 50,
                    height: 50,
                  })
              )
            }
          >
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
  const create = useCreateObject();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              create(
                ({ pointer }) =>
                  new fabric.Circle({
                    id: nanoid(),
                    name: "Circle",
                    top: pointer.y,
                    left: pointer.x,
                    radius: 50,
                    fill: "black",
                  })
              )
            }
          >
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

const TextTool = () => {
  const create = useCreateObject();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              create(({ pointer }) => {
                const text = new fabric.IText("Text", {
                  id: nanoid(),
                  top: pointer.y,
                  left: pointer.x,
                  fontSize: 24,
                  name: "Text",
                });
                text.enterEditing();
                text.selectAll();
                return text;
              })
            }
          >
            <Type size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Text Tool</p>
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
      <TextTool />
    </Card>
  );
};

export default ToolBar;
