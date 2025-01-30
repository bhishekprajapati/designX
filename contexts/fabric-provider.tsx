"use client";

import { Canvas } from "fabric";
import { createContext, forwardRef, useState } from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { FabricCanvasHydrationState } from "@/liveblocks.config";

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
  initialCanvasState: FabricCanvasHydrationState;
};

const FabricCanvasProvider = (props: FabricCanvasProviderProps) => {
  const { children, initialCanvasState } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<TFabricCanvasContext>(null);
  const [ctx, setCtx] = useState<TFabricCanvasContext>(null);

  /**
   * Resposible for creating dataless instance
   * of fabric canvas after mounting.
   */
  useEffect(() => {
    if (!canvasRef.current) return;
    const parentEl = canvasRef.current.parentElement!;

    const canvas = new Canvas(canvasRef.current, {
      width: parentEl.clientWidth,
      height: parentEl.clientHeight,
    });

    const resizer = new ResizeObserver(() => {
      if (!parentEl) return;
      canvas.setWidth(parentEl.clientWidth);
      canvas.setHeight(parentEl.clientHeight);
      canvas.renderAll();
    });

    resizer.observe(parentEl);
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
      resizer.disconnect();
      setFabricCanvas(null);
    };
  }, []);

  /**
   * Responsible for one-time hydration as soon as
   * fabric canvas instance is available.
   * Once hydration is complete ctx will be set
   * of this provider. to render other parts of ui
   * down in the tree.
   */
  useEffect(() => {
    if (!fabricCanvas) {
      setCtx(null);
      return;
    }

    fabricCanvas
      .loadFromJSON(initialCanvasState)
      .then(() => {
        setCtx(fabricCanvas);
        fabricCanvas.renderAll();
      })
      .catch((err) => {
        console.error(err);
        setCtx(null);
      });

    return () => {
      setCtx(null);
    };
  }, [fabricCanvas]);

  // I choose render function to make it easy
  // for direct components to render conditionally
  // based on if the context has initialized.
  // this simplifies `useCanvas` hook without
  // having to implement additional state flags like
  // `isInitialized` or `isHydrated`
  return (
    <FabricCanvasContext.Provider value={ctx}>
      {children({ ctx, fabricCanvas: <FabricCanvas ref={canvasRef} /> })}
    </FabricCanvasContext.Provider>
  );
};

export default FabricCanvasProvider;
