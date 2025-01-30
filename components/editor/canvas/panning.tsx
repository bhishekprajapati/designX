"use client";

import type { TPointerEvent, TPointerEventInfo } from "fabric";

import { useEffect, useRef } from "react";

import { useCanvas } from "@/hooks/use-fabric";
import useTools from "@/hooks/use-tools";

const CanvasPanning = () => {
  const tools = useTools();
  const canvas = useCanvas();
  const isPanningRef = useRef(false);
  const lastPosX = useRef(0);
  const lastPosY = useRef(0);

  useEffect(() => {
    const handleModeChange = (ev: KeyboardEvent) => {
      if (ev.code === "Space") {
        tools.setMode("hand");
        const handleCleanUp = (ev: KeyboardEvent) => {
          if (ev.code === "Space") {
            tools.setMode("move");
            window.removeEventListener("keyup", handleCleanUp);
          }
        };
        window.addEventListener("keyup", handleCleanUp);
      }
    };
    window.addEventListener("keydown", handleModeChange);
    return () => {
      window.removeEventListener("keydown", handleModeChange);
    };
  }, [tools]);

  useEffect(() => {
    if (tools.mode !== "hand") return;

    type TEvent = TPointerEventInfo<TPointerEvent> & {
      e: { clientX: number; clientY: number };
    };

    const startPanning = function (ev: TEvent) {
      isPanningRef.current = true;
      canvas.selection = false;
      lastPosX.current = ev.e.clientX;
      lastPosY.current = ev.e.clientY;
    };

    const panning = (ev: TEvent) => {
      if (!isPanningRef.current) return;
      const deltaX = ev.e.clientX - lastPosX.current;
      const deltaY = ev.e.clientY - lastPosY.current;
      const vpt = canvas.viewportTransform;
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      canvas.requestRenderAll();
      lastPosX.current = ev.e.clientX;
      lastPosY.current = ev.e.clientY;
    };

    const stopPanning = () => {
      if (!isPanningRef.current) return;
      isPanningRef.current = false;
      canvas.selection = true;
      canvas.setViewportTransform(canvas.viewportTransform);
    };

    canvas.on("mouse:down", startPanning);
    canvas.on("mouse:move", panning);
    canvas.on("mouse:up", stopPanning);

    return () => {
      canvas.off("mouse:down", startPanning);
      canvas.off("mouse:move", panning);
      canvas.off("mouse:up", stopPanning);
    };
  }, [canvas, tools.mode]);

  return <></>;
};

export default CanvasPanning;
