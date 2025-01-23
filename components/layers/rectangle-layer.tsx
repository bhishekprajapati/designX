"use client";

import { useEffect, useRef, useState } from "react";
import { Rect, type Canvas } from "fabric";
import type { TLiveLayerData } from "@/liveblocks.config";

export type TRectangleLayerProps = {
  canvas: Canvas;
  layer: TLiveLayerData;
  onModified?: (state: TLiveLayerData) => void;
};

export function RectangleLayer(props: TRectangleLayerProps) {
  const { layer, canvas, onModified } = props;
  const rectRef = useRef(new Rect());

  const update = (layer: TLiveLayerData) => {
    const { id, name, top, left, width, height } = layer;
    rectRef.current.id = id;
    rectRef.current.name = name;
    rectRef.current.top = top;
    rectRef.current.left = left;
    rectRef.current.width = width;
    rectRef.current.height = height;
  };

  useEffect(() => {
    onModified &&
      rectRef.current.on("modified", (e) => {
        const state = {
          id: e.target.id,
          type: "Rect" as const,
          name: e.target.name,
          top: e.target.top,
          left: e.target.left,
          width: e.target.getScaledWidth(),
          height: e.target.getScaledHeight(),
        };
        onModified(state);
      });

    canvas.add(rectRef.current);
    canvas.renderAll();

    return () => {
      canvas.remove(rectRef.current);
    };
  }, [canvas]);

  useEffect(() => {
    update(layer);
    canvas.renderAll();
  }, [layer]);

  return <></>;
}
