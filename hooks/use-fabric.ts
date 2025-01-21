"use client";

import { useEffect, useState } from "react";
import useCanvas from "./use-canvas";
import {
  FabricObject,
  FabricObjectProps,
  ObjectEvents,
  SerializedObjectProps,
} from "fabric";

export const useSelected = () => {
  type Selectable = FabricObject<
    Partial<FabricObjectProps>,
    SerializedObjectProps,
    ObjectEvents
  >;

  const canvas = useCanvas();
  const [selected, setSelected] = useState<Selectable[]>([]);

  useEffect(() => {
    if (!canvas) return;

    const created = ({ selected }: { selected: Selectable[] }) =>
      setSelected(selected);

    const updated = ({ selected }: { selected: Selectable[] }) =>
      setSelected(selected);

    const cleared = ({ deselected }: { deselected: Selectable[] }) =>
      setSelected(
        Array.from(new Set(selected).difference(new Set(deselected)))
      );

    canvas.on("selection:created", created);
    canvas.on("selection:updated", updated);
    canvas.on("selection:cleared", cleared);

    return () => {
      canvas.off("selection:created", created);
      canvas.off("selection:updated", updated);
      canvas.off("selection:cleared", cleared);
    };
  }, [canvas]);

  return selected;
};
