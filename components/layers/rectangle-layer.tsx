"use client";

import { useEffect } from "react";
import { Rect, type Canvas } from "fabric";
import type { ILiveRectLayerData } from "@/liveblocks.config";

export type TRectangleLayerProps = {
  canvas: Canvas;
  layer: ILiveRectLayerData;
  onModified?: (state: ILiveRectLayerData) => void;
};

export function RectangleLayer(props: TRectangleLayerProps) {
  const {
    layer: { type, ...layer },
    canvas,
    onModified,
  } = props;

  useEffect(() => {
    let rect = canvas.getObjects().find((obj) => obj.id === layer.id);
    if (!rect) {
      rect = new Rect({ ...layer, id: layer.id });
      canvas.add(rect);
    } else {
      rect.set(layer);
      rect.setCoords();
    }

    onModified && rect.on("modified", (e) => onModified(e.target.toObject()));
    return () => {
      canvas.remove(rect);
      canvas.renderAll();
    };
  }, [canvas, layer, onModified]);

  return <></>;
}
