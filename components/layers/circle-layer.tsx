"use client";

import { useEffect } from "react";
import { Circle, type Canvas } from "fabric";
import type { TLiveLayerData } from "@/liveblocks.config";

export type TCircleLayerProps = {
  canvas: Canvas;
  layer: TLiveLayerData;
  onModified?: (state: TLiveLayerData) => void;
};

export function CircleLayer(props: TCircleLayerProps) {
  const { layer, canvas, onModified } = props;

  useEffect(() => {
    let circle = canvas.getObjects().find((obj) => obj.id === layer.id);
    if (!circle) {
      circle = new Circle(layer);
      canvas.add(circle);
    } else {
      circle.set(layer);
      circle.setCoords();
    }
    onModified && circle.on("modified", (e) => onModified(e.target.toObject()));

    return () => {
      canvas.remove(circle);
      canvas.renderAll();
    };
  }, [canvas, layer, onModified]);

  return <></>;
}
