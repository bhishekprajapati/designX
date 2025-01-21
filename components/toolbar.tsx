"use client";

import { Circle, Square } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import useTools from "@/hooks/use-tools";
import { useSelected } from "@/hooks/use-fabric";
import { useEffect } from "react";
import useCanvas from "@/hooks/use-canvas";

const ToolBar = () => {
  const canvas = useCanvas();
  const tools = useTools();
  const selected = useSelected();

  const addRect = () => {
    tools.shapes.add("rect", {
      name: "Rectangle",
    });
  };

  const addCircle = () => {
    tools.shapes.add("circle", {
      name: "Circle",
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
      <Button variant="ghost" size="icon" onClick={addCircle}>
        <Circle size={16} />
      </Button>
    </Card>
  );
};

export default ToolBar;
