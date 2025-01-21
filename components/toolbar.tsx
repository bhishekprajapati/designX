"use client";

import { Circle, Square } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import useTools from "@/hooks/use-tools";

const ToolBar = () => {
  const tools = useTools();

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
