"use client";

import { useEffect } from "react";
import * as fabric from "fabric";
import { nanoid } from "nanoid";
import { Circle, Hand, MousePointer2, Square } from "lucide-react";

import { useSelected } from "@/hooks/use-fabric";
import { useCanvas } from "@/hooks/use-fabric";
import { useMutation } from "@liveblocks/react";
import { LiveList, LiveObject } from "@liveblocks/client";
import type { TLiveLayerData } from "@/liveblocks.config";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useTools from "@/hooks/use-tools";

const Tools = () => {
  const canvas = useCanvas();
  const selected = useSelected();
  const tools = useTools();

  const addLayer = useMutation(({ storage }, layer: TLiveLayerData) => {
    const fabric = storage.get("fabricCanvas");
    const layers = fabric.get("layers");
    if (!layers) fabric.set("layers", new LiveList([]));
    layers.push(new LiveObject(layer));
  }, []);

  const addRect = () => {
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
      addLayer(rect.toJSON() as TLiveLayerData);
    });
  };

  const addCircle = () => {
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
      addLayer(circle.toJSON() as TLiveLayerData);
      console.log("og: ", circle.toJSON());
    });
  };

  useEffect(() => {
    const remove = (event: KeyboardEvent) => {
      if (event.key === "Delete" && canvas) {
        canvas.remove(...selected.values());
        canvas.renderAll();
      }
    };
    window.addEventListener("keydown", remove);

    return () => {
      window.removeEventListener("keydown", remove);
    };
  }, [selected, canvas]);

  return (
    <Card className="flex gap-4 p-2">
      <Button
        variant={tools.mode === "move" ? "default" : "ghost"}
        size="icon"
        onClick={() => tools.setMode("move")}
      >
        <MousePointer2 size={16} />
      </Button>
      <Button
        variant={tools.mode === "hand" ? "default" : "ghost"}
        size="icon"
        onClick={() => tools.setMode("hand")}
      >
        <Hand size={16} />
      </Button>
      <Button variant="ghost" size="icon" onClick={addRect}>
        <Square size={16} />
      </Button>
      <Button variant="ghost" size="icon" onClick={addCircle}>
        <Circle size={16} />
      </Button>
    </Card>
  );
};

export default Tools;
