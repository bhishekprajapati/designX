"use client";

import { useCanvas, useSelected } from "@/hooks/use-fabric";
import { Block, BlockGroup, BlockGroupLabel, BlockLabel } from "./block";
import { useEffect, useRef, useState } from "react";
import type { ModifiedEvent, TPointerEvent } from "fabric";

const Previewer = () => {
  return <div></div>;
};

const Exporter = () => {
  const canvas = useCanvas();
  const selected = useSelected();
  const [isEmpty, setIsEmpty] = useState(selected.size === 0);
  const [preview, setPreview] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsEmpty(selected.size === 0);
  }, [selected]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ar = canvas.width / canvas.height; // aspect ratio
    const width = containerRef.current.clientWidth;
    setPreview(
      canvas.toDataURL({
        format: "png",
        width,
        height: width / ar,
        multiplier: window.devicePixelRatio || 1,
        quality: 0.8,
      })
    );
  }, [canvas, isEmpty]);

  if (!isEmpty) return <></>;

  return (
    <Block>
      <BlockLabel>Export</BlockLabel>
      <BlockGroup>
        <BlockGroupLabel>Preview</BlockGroupLabel>
        <div ref={containerRef}>
          {preview && <img className="w-full" src={preview} />}
        </div>
      </BlockGroup>
    </Block>
  );
};

export default Exporter;
