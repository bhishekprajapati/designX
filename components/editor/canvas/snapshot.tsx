"use client";

import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { useCanvas } from "@/hooks/use-fabric";
import { cn } from "@/lib/utils";
import { useMutation, useStorage, useSyncStatus } from "@liveblocks/react";

const CanvasSnapshot: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  const { className, ...restProps } = props;
  const snapshot = useStorage((root) => root.fabricCanvas.snapshot);
  const canvas = useCanvas();
  const update = useMutation(({ storage }, snapshot: string) => {
    const canvas = storage.get("fabricCanvas");
    canvas.update({
      snapshot,
    });
  }, []);

  const capture = useCallback(
    debounce(
      () => {
        update(canvas.toDataURL());
      },
      1000,
      {
        trailing: true,
      }
    ),
    [canvas, update]
  );

  // capture snapshot after every canvas render (debounced)
  useEffect(() => {
    canvas.on("after:render", capture);
    return () => {
      canvas.off("after:render", capture);
    };
  }, [canvas, capture]);

  return (
    <div className={cn(className)} {...restProps}>
      {snapshot && <img className="aspect-video object-cover" src={snapshot} />}
    </div>
  );
};

export default CanvasSnapshot;
