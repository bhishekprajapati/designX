"use client";

import { FocusEventHandler, useCallback, useEffect } from "react";
import { useState } from "react";
import {
  SerializedObjectProps,
  ObjectEvents,
  type TEvent,
  Rect,
  Circle,
} from "fabric";
import { FabricObject } from "fabric";
import { Circle as IconCircle, Eye, EyeClosed, Square } from "lucide-react";
import { omit } from "remeda";

import { Button, buttonVariants } from "@ui/button";

import {
  useActiveObject,
  useCanvas,
  useFabricObjects,
} from "@/hooks/use-fabric";
import { useSelected } from "@/hooks/use-fabric";
import {
  ICircleLayerData,
  IRectLayerData,
  LayerType,
} from "@/liveblocks.config";
import { cn } from "@/lib/utils";
import { shallow, useMutation, useStorage } from "@liveblocks/react";
import { LiveList, LiveObject } from "@liveblocks/client";

declare module "fabric" {
  interface FabricObject {
    id: string;
    name: string;
    type: LayerType;
  }

  interface SerializedObjectProps {
    id: string;
    name: string;
  }

  interface CanvasEvents {
    /**
     * This will get fired when meta `name` or
     * `visibility` are modified of an object
     */
    "object:modified:meta": Partial<TEvent> & {
      target: FabricObject;
    };

    "object:remove": Partial<TEvent> & {
      target: FabricObject;
    };
  }

  interface ObjectEvents {
    sync: Partial<TEvent> & {
      target: FabricObject;
    };

    "modified:name": Partial<TEvent> & {
      target: FabricObject;
    };

    "modified:visibility": Partial<TEvent> & {
      target: FabricObject;
    };
  }
}

FabricObject.customProperties = ["name", "id"];

type FabricObjectCardProps = {
  isSelected: boolean;
  isVisible: boolean;
  name: string;
  type: LayerType;
  onNameChange: (name: string) => void;
  onVisibilityChange: (visible: boolean) => void;
  onSelect: () => void;
};

const FabricObjectCard = (props: FabricObjectCardProps) => {
  const {
    isSelected,
    isVisible,
    name,
    onNameChange,
    onSelect,
    onVisibilityChange,
  } = props;
  const [allowEditing, setAllowEditing] = useState(false);

  // NOTE: in serialized fabric objects the first
  // character of the word prop `type` is capitalized
  // but for in-memory objects the whole type string
  // is in lowercase. God knows why?
  const type = props.type.toLowerCase();

  const handleNameChange: FocusEventHandler<HTMLInputElement> = (e) => {
    setAllowEditing(false);
    const newName = e.target.value.trim();
    if (!newName.length) return;
    if (newName === name) return;
    onNameChange(newName);
  };

  return (
    <div
      className={cn("hover:cursor-pointer", isVisible ? "" : "opacity-50")}
      onClick={onSelect}
    >
      <div
        className={buttonVariants({
          variant: allowEditing || isSelected ? "secondary" : "ghost",
          size: "lg",
          className: "w-full !px-3 group",
        })}
      >
        <span>
          {type === "rect" && <Square className="scale-75" size={8} />}
          {type === "circle" && <IconCircle className="scale-75" size={8} />}
        </span>
        {allowEditing ? (
          <input
            defaultValue={name}
            className="p-1 ps-2 w-full focus:outline-none rounded-lg"
            onBlur={handleNameChange}
            spellCheck="false"
            autoComplete="false"
            autoFocus
          />
        ) : (
          <span
            className="text-sm cursor-pointer"
            onDoubleClick={(e) => setAllowEditing(true)}
          >
            {name}
          </span>
        )}
        {!allowEditing && (
          <Button
            className={cn(
              "ms-auto",
              "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
              { "!opacity-100 !pointer-events-auto": !isVisible }
            )}
            size="icon"
            variant="ghost"
            onClick={(e) => {
              onVisibilityChange(!isVisible);
              e.stopPropagation();
            }}
          >
            {isVisible ? (
              <Eye className="scale-75" />
            ) : (
              <EyeClosed className="scale-75" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

type FabricObjectListItemProps = {
  obj: FabricObject<
    Partial<FabricObjectListItemProps>,
    SerializedObjectProps,
    ObjectEvents
  >;
};

const FabricObjectListItem = (props: FabricObjectListItemProps) => {
  const { obj } = props;
  const canvas = useCanvas();
  const selectedLayers = useSelected();
  const [, setActiveObject] = useActiveObject();

  const patchLiveObject = useMutation(
    ({ storage }) => {
      const liveLayers = storage.get("fabricCanvas").get("layers");
      const liveObject = liveLayers.find(
        (liveLayer) => liveLayer.get("id") === obj.id
      );
      if (!liveObject) return;
      liveObject.update(obj.toObject());
    },
    [obj]
  );

  /**
   * Shallow comparison is used here to get
   * reactive updates at fabric object level.
   * This will avoid re-rendering of
   * all the fabric objects when only single
   * live state gets updated for a single local
   * fabric object
   */
  const liveObjectState = useStorage((root) => {
    const liveObject = root.fabricCanvas.layers;
    const target = liveObject.find((liveObject) => liveObject.id === obj.id);
    return target;
  }, shallow);

  const handleNameChange = useCallback(
    (name: string) => {
      obj.name = name;
      obj.fire("modified:name", {
        target: obj,
      });
    },
    [obj]
  );

  const handleVisibilityChange = useCallback(
    (visible: boolean) => {
      obj.visible = visible;
      canvas.requestRenderAll();
      obj.fire("modified:visibility", {
        target: obj,
      });
    },
    [obj]
  );

  const handleSelection = useCallback(
    (object: typeof obj) => {
      setActiveObject(obj);
    },
    [obj]
  );

  // handle live patches for a fabric object
  useEffect(() => {
    const sync = () => obj.fire("sync", { target: obj });
    const disposers = [
      obj.on("modified", sync),
      obj.on("modified:name", sync),
      obj.on("modified:visibility", sync),
      obj.on("sync", () => patchLiveObject()),
    ];
    return () => disposers.forEach((dispose) => dispose());
  }, [obj, patchLiveObject]);

  /**
   * pulls live changes for a fabric object
   */
  useEffect(() => {
    if (liveObjectState) {
      obj.set(omit(liveObjectState, ["type"]));
      obj.setCoords();
      canvas.requestRenderAll();
    }
  }, [liveObjectState]);

  return (
    <FabricObjectCard
      type={obj.type}
      name={obj.name}
      isVisible={obj.visible}
      isSelected={selectedLayers.has(obj.id)}
      onNameChange={handleNameChange}
      onSelect={() => handleSelection(obj)}
      onVisibilityChange={handleVisibilityChange}
    />
  );
};

const SyncAddedOrRemovedObjects = () => {
  const canvas = useCanvas();
  const localObjects = useFabricObjects();
  const liveObjects = useStorage((root) => root.fabricCanvas.layers);

  const add = useMutation(
    ({ storage }, objectData: IRectLayerData | ICircleLayerData) => {
      const fabric = storage.get("fabricCanvas");
      const layers = fabric.get("layers");
      if (!layers) fabric.set("layers", new LiveList([]));
      // @ts-expect-error
      layers.push(new LiveObject(objectData));
    },
    [liveObjects]
  );

  const remove = useMutation(
    ({ storage }, id) => {
      const states = storage.get("fabricCanvas").get("layers");
      const index = states.findIndex((state) => state.get("id") === id);
      if (index === -1) return;
      states.delete(index);
    },
    [liveObjects]
  );

  useEffect(() => {
    if (liveObjects === null) return;
    const localMap = new Map(localObjects.map((obj) => [obj.id, obj]));
    const liveMap = new Map(liveObjects.map((obj) => [obj.id, obj]));

    const addedObjectMap = (() => {
      const map = new Map<string, IRectLayerData | ICircleLayerData>();
      liveMap.forEach((value, key) => {
        if (localMap.has(key)) return;
        map.set(key, value);
      });
      return map;
    })();

    const removedObjectMap = (() => {
      const map = new Map<string, ArrayType<typeof localObjects>>();
      localMap.forEach((value, key) => {
        if (liveMap.has(key)) return;
        map.set(key, value);
      });
      return map;
    })();

    addedObjectMap.forEach((state) => {
      switch (state.type) {
        case "Rect":
          const rect = new Rect();
          rect.set(omit(state, ["type"]));
          rect.setCoords();
          canvas.add(rect);
          break;
        case "Circle":
          const circle = new Circle();
          circle.set(omit(state, ["type"]));
          circle.setCoords();
          canvas.add(circle);
          break;
      }
    });

    const removeTargets = Array.from(removedObjectMap.entries()).map(
      ([, object]) => object
    );
    canvas.remove(...removeTargets);
    canvas.requestRenderAll();
  }, [canvas, localObjects, liveObjects]);

  useEffect(() => {
    const disposers = [
      canvas.on("object:added", ({ target }) => add(target.toJSON())),
      canvas.on("object:remove", ({ target }) => remove(target.id)),
    ];
    return () => disposers.forEach((dispose) => dispose());
  }, [canvas, add, remove]);

  return <></>;
};

export const FabricObjectList = () => {
  /**
   * This list will only be re-rendered
   * either when new objects are added
   * or existing objects are removed
   */
  const objs = useFabricObjects();

  return (
    <ul className="[&>*:not(:last-child)]:mb-2">
      {objs.map((obj) => (
        <li key={obj.id}>
          <FabricObjectListItem obj={obj} />
        </li>
      ))}
      <SyncAddedOrRemovedObjects />
    </ul>
  );
};
