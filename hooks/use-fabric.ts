"use client";

import { useContext, useEffect, useState } from "react";
import { ActivatedObjectContext } from "@/components/activated-object";

import {
  Canvas,
  CanvasEvents,
  FabricObject,
  FabricObjectProps,
  ObjectEvents,
  SerializedObjectProps,
} from "fabric";
import { FabricCanvasContext } from "@/contexts/fabric-provider";

export const useCanvas = () => {
  const ctx = useContext(FabricCanvasContext);
  if (!ctx) {
    throw Error("FabricCanvas is uninitialized");
  }
  return ctx;
};

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

  const getActiveObject = () => {
    if (selected.size !== 1) return null;
    // this method `canvas.getActiveObject` as of fabric v6.5.4
    // returns a fabric object if only one object is selected
    // otherwise null. In simple words, this will always return null
    // in group selections
    const active = canvas.getActiveObject();
    if (!active) return null;
    return selected.get(active.id);
  };

  const setActive = (obj: FabricObject) => {
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  return [getActiveObject(), setActive] as const;
};

export const useActivatedObject = () => {
  const ctx = useContext(ActivatedObjectContext);
  if (ctx === undefined) {
    throw Error("Must be called inside ActivatedObjectContext");
  }
  return ctx;
};

type LayerObject = ArrayType<ReturnType<Canvas["getObjects"]>>;

type UseFabricObjectsOptions = {
  events?: Array<"object:added" | "object:modified" | "object:removed">;
};

/**
 * Returns a list of local fabric objects
 */
export const useFabricObjects = (
  opts: UseFabricObjectsOptions = { events: ["object:added", "object:removed"] }
) => {
  const canvas = useCanvas();
  const [layers, setLayers] = useState<LayerObject[]>(canvas.getObjects());

  useEffect(() => {
    if (!opts.events || !opts.events.length) return;
    // to remove duplicated event names
    const events = new Array(...new Set(opts.events));
    const handler = () => setLayers(canvas.getObjects());

    // register specified events and collect disposers
    const disposers: Array<VoidFunction> = [];
    events.forEach((event) => {
      const disposer = canvas.on(event, handler);
      disposers.push(disposer);
    });

    return () => {
      // invoke all the disposers
      disposers.forEach((disposer) => disposer());
    };
  }, [canvas, opts.events]);

  return layers;
};
