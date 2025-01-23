"use client";

import { Square } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useSelected } from "@/hooks/use-fabric";
import { useEffect } from "react";
import useCanvas from "@/hooks/use-canvas";
import { useMutation } from "@liveblocks/react";
import { LiveList, LiveObject } from "@liveblocks/client";
import { Rect, Circle } from "fabric";
import { nanoid } from "nanoid";
import type { TLiveLayerData } from "@/liveblocks.config";

const ToolBar = () => {
  const canvas = useCanvas();
  const selected = useSelected();

  const addLayer = useMutation(({ storage }, layer: TLiveLayerData) => {
    const fabric = storage.get("fabricCanvas");
    const layers = fabric.get("layers");
    if (!layers) fabric.set("layers", new LiveList([]));
    layers.push(new LiveObject(layer));
  }, []);

  const addRect = () => {
    if (!canvas) return;
    canvas.defaultCursor = "crosshair";
    canvas.once("mouse:down", ({ pointer }) => {
      const rect = new Rect({
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
      const layer = rect.toJSON() as TLiveLayerData;
      console.log("og", layer);
      addLayer(layer);
    });
  };

  const addCircle = () => {
    if (!canvas) return;
    canvas.defaultCursor = "crosshair";
    canvas.once("mouse:down", ({ pointer }) => {
      const circle = new Circle({
        id: nanoid(),
        name: "Circle",
        top: pointer.y,
        left: pointer.x,
      });

      canvas.add(circle);
      canvas.setActiveObject(circle);
      canvas.defaultCursor = "default";
    });
  };

  useEffect(() => {
    // delete selected
    const remove = (event: KeyboardEvent) => {
      if (event.key === "Delete" && canvas) {
        canvas.remove(...selected);
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
      <Button variant="ghost" size="icon" onClick={addRect}>
        <Square size={16} />
      </Button>
      {/* <Button variant="ghost" size="icon" onClick={addCircle}>
        <Circle size={16} />
      </Button> */}
    </Card>
  );
};

export default ToolBar;
