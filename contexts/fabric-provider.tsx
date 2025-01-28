"use client";

import { Canvas, type CanvasOptions } from "fabric";
import { createContext, forwardRef, useState } from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useStorage } from "@liveblocks/react";

type FabricCanvasProps = React.HTMLProps<HTMLDivElement>;
const FabricCanvas = forwardRef<HTMLCanvasElement, FabricCanvasProps>(
  (props, ref) => {
    const { className, ...restProps } = props;
    return (
      <div className={cn("relative w-full h-full", className)} {...restProps}>
        <canvas ref={ref} />
      </div>
    );
  }
);
FabricCanvas.displayName = "FabricCanvas";

export type TFabricCanvasContext = Canvas | null;
export const FabricCanvasContext = createContext<TFabricCanvasContext>(null);

export type FabricCanvasProviderProps = {
  children: (params: {
    ctx: TFabricCanvasContext;
    fabricCanvas: JSX.Element;
  }) => React.ReactNode;
  options?: Partial<Omit<CanvasOptions, "width" | "height">>;
};

const FabricCanvasProvider = (props: FabricCanvasProviderProps) => {
  const { children, options } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<TFabricCanvasContext>(null);
  const background =
    useStorage((root) => root.fabricCanvas.background) ?? "gray";

  useEffect(() => {
    if (!canvasRef.current) return;
    const parentEl = canvasRef.current.parentElement!;

    const canvas = new Canvas(canvasRef.current, {
      width: parentEl.clientWidth,
      height: parentEl.clientHeight,
      selectionColor: "rgba(0, 97, 242, 0.1)",
      selectionBorderColor: "#0061F2",
      selectionLineWidth: 1,
      backgroundColor: background,
      ...options,
      hoverCursor: "pointer",
    });

    const resizer = new ResizeObserver(() => {
      if (!parentEl) return;
      canvas.setWidth(parentEl.clientWidth);
      canvas.setHeight(parentEl.clientHeight);
      canvas.renderAll();
    });

    resizer.observe(parentEl);
    setCtx(canvas);

    return () => {
      canvas.dispose();
      resizer.disconnect();
      setCtx(null);
    };
  }, [options]);

  useEffect(() => {
    if (!ctx) return;
    ctx.backgroundColor = background;
    ctx.renderAll();
    console.log(ctx.toJSON());
  }, [background]);

  return (
    <FabricCanvasContext.Provider value={ctx}>
      {children({ ctx, fabricCanvas: <FabricCanvas ref={canvasRef} /> })}
    </FabricCanvasContext.Provider>
  );
};

export default FabricCanvasProvider;
