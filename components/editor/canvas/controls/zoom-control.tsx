"use client";

import { Point } from "fabric";
import { FocusEventHandler, useEffect, useRef, useState } from "react";

import { Input } from "@ui/input";
import { useCanvas } from "@/hooks/use-fabric";

const ZoomControl = () => {
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 20;
  const ZOOM_FACTOR = 0.999;

  const canvas = useCanvas();
  const [zoom, setZoom] = useState(canvas.getZoom());
  const inputRef = useRef<HTMLInputElement>(null);

  const toPercentage = (value: number) => {
    if (Number.isNaN(value)) return value;
    return Math.trunc(value * 100);
  };

  const handleZoomChange = (zoom: number, point?: Point) => {
    const boundedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
    point
      ? canvas.zoomToPoint(point, boundedZoom)
      : canvas.setZoom(boundedZoom);
    setZoom(boundedZoom);

    if (inputRef.current) {
      inputRef.current.value = toPercentage(boundedZoom).toString();
    }
  };

  const handleInputZoomChange: FocusEventHandler<HTMLInputElement> = (e) => {
    const value = parseFloat(e.target.value) / 100;
    if (Number.isNaN(value)) {
      if (inputRef.current) {
        inputRef.current.value = toPercentage(zoom).toString();
      }
      return;
    }
    handleZoomChange(value);
  };

  useEffect(() => {
    canvas.on("mouse:wheel", (ctx) => {
      if (ctx.e.ctrlKey) {
        const delta = ctx.e.deltaY;
        const zoom = canvas.getZoom() * ZOOM_FACTOR ** delta;
        handleZoomChange(
          zoom,
          new Point({ x: ctx.e.offsetX, y: ctx.e.offsetY })
        );
        ctx.e.preventDefault();
        ctx.e.stopPropagation();
      }
    });
  }, [canvas]);

  useEffect(() => {
    const doubleOrHalve = (ev: KeyboardEvent) => {
      if (!ev.ctrlKey || !["+", "-"].includes(ev.key)) return;
      handleZoomChange(ev.key === "+" ? zoom * 2 : zoom / 2);
    };

    window.addEventListener("keydown", doubleOrHalve);
    return () => {
      window.removeEventListener("keydown", doubleOrHalve);
    };
  }, [canvas, zoom]);

  return (
    <Input
      ref={inputRef}
      defaultValue={`${toPercentage(zoom)}`}
      onBlur={handleInputZoomChange}
      className="w-10 h-4"
      spellCheck="false"
      autoComplete="false"
    />
  );
};

export default ZoomControl;
