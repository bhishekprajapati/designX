"use client";

import { CanvasContext } from "@/contexts/canvas-provider";
import { FabricCanvasContext } from "@/contexts/fabric-provider";
import { useContext } from "react";

// const useCanvas = () => {
//   const ctx = useContext(CanvasContext);
//   if (!ctx) {
//     throw Error("Must be called inside CanvasProvider");
//   }
//   return ctx.getCanvas();
// };

const useCanvas = () => {
  const ctx = useContext(FabricCanvasContext);
  if (!ctx) {
    throw Error("FabricCanvas is uninitialized");
  }
  return ctx;
};

export default useCanvas;
