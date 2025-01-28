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
  const [selected, setSelected] = useState<Map<string, Selectable>>(new Map());

  useEffect(() => {
    const upsert = ({ selected }: { selected: Selectable[] }) => {
      const map = new Map<string, Selectable>();
      selected.forEach((obj) => map.set(obj.id, obj));
      setSelected(map);
    };

    const cleared = ({ deselected }: { deselected: Selectable[] }) => {
      const map = new Map<string, Selectable>();
      deselected.map((obj) => map.delete(obj.id));
      setSelected(new Map(map.entries()));
    };

    canvas.on("selection:created", upsert);
    canvas.on("selection:updated", upsert);
    canvas.on("selection:cleared", cleared);

    return () => {
      canvas.off("selection:created", upsert);
      canvas.off("selection:updated", upsert);
      canvas.off("selection:cleared", cleared);
    };
  }, [canvas]);

  return selected;
};

export const useActiveObject = () => {
  const canvas = useCanvas();
  const selected = useSelected();

  if (selected.size !== 1) return;
  const obj = canvas.getActiveObject();
  if (!obj) return;

  return selected.get(obj.id);
};
