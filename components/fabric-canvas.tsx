"use client";

import { useTheme } from "next-themes";
import { Fragment, useContext, useEffect, useRef } from "react";
import { Canvas, type CanvasOptions } from "fabric";
import { CanvasContext } from "@/contexts/canvas-provider";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import useCanvas from "@/hooks/use-canvas";
import { RectangleLayer } from "./layers";
import { TLiveLayerData } from "@/liveblocks.config";
import { CircleLayer } from "./layers/circle-layer";

const Layers = () => {
  const canvas = useCanvas();
  const layers = useStorage(({ fabricCanvas }) => fabricCanvas.layers) ?? [];

  const modify = useMutation(({ storage }, layer: TLiveLayerData) => {
    const target = storage
      .get("fabricCanvas")
      .get("layers")
      .find((liveLayer) => liveLayer.get("id") === layer.id);

    target?.update(layer);
  }, []);

  if (!canvas) return <></>;

  return (
    <>
      {layers.map((layer) => (
        <Fragment key={layer.id}>
          {layer.type === "Rect" && (
            <RectangleLayer
              canvas={canvas}
              layer={layer}
              onModified={(state) => modify(state)}
            />
          )}
          {layer.type === "Circle" && (
            <CircleLayer
              canvas={canvas}
              layer={layer}
              onModified={(state) => modify(state)}
            />
          )}
        </Fragment>
      ))}
    </>
  );
};

export type FabricProps = {
  options?: Partial<Omit<CanvasOptions, "width" | "height">>;
} & React.HTMLProps<HTMLDivElement>;

const FabricCanvas: React.FC<FabricProps> = (props) => {
  const { options, ...restProps } = props;

  const mode = useTheme();
  const background = useStorage((root) => root.fabricCanvas.background);

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
      backgroundColor: background,
      ...options,
      hoverCursor: "pointer",
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

  useEffect(() => {
    const canvas = ctx.getCanvas();
    if (!canvas) return;
    canvas.backgroundColor = background;
    canvas.renderAll();
    console.log(canvas.toJSON());
  }, [background]);

  return (
    <div {...restProps}>
      <div ref={containerRef} className="relative w-full h-full">
        <canvas ref={canvasRef} />
        <Layers />
      </div>
    </div>
  );
};

export default FabricCanvas;
