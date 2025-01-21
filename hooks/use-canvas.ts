"use client";

import { CanvasContext } from "@/contexts/canvas-provider";
import { useContext } from "react";

const useCanvas = () => {
  const ctx = useContext(CanvasContext);
  if (!ctx) {
    throw Error("Must be called inside FabricProvider");
  }
  return ctx.getCanvas();
};

export default useCanvas;
