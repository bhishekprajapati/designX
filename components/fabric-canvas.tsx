"use client";

import { useTheme } from "next-themes";
import { useContext, useEffect, useRef } from "react";
import { Canvas, type CanvasOptions } from "fabric";
import { CanvasContext } from "@/contexts/canvas-provider";

export type FabricProps = {
  options?: Partial<Omit<CanvasOptions, "width" | "height">>;
} & React.HTMLProps<HTMLDivElement>;

const FabricCanvas: React.FC<FabricProps> = (props) => {
  const { options, className, ...restProps } = props;

  const mode = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useContext(CanvasContext);

  if (!ctx) {
    throw Error("Must be called inside Canvas Provider");
  }

  useEffect(() => {
    if (!(canvasRef.current && containerRef.current)) return;
    const canvas = new Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      selectionColor: "rgba(0, 97, 242, 0.1)",
      selectionBorderColor: "#0061F2",
      selectionLineWidth: 1,
      backgroundColor: mode.resolvedTheme === "light" ? "#ddd" : "#0f172a",
      ...options,
    });

    const resizer = new ResizeObserver(() => {
      if (!containerRef.current) return;
      canvas.setWidth(containerRef.current.clientWidth);
      canvas.setHeight(containerRef.current.clientHeight);
      canvas.renderAll();
    });

    resizer.observe(containerRef.current);
    ctx.setCanvas(canvas);

    return () => {
      canvas.dispose();
      resizer.disconnect();
      ctx.setCanvas(null);
    };
  }, [options, mode]);

  return (
    <div {...restProps}>
      <div ref={containerRef} className="relative w-full h-full">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default FabricCanvas;
