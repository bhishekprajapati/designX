"use client";

import { FocusEventHandler, useCallback, useEffect } from "react";
import { useState } from "react";
import { SerializedObjectProps, ObjectEvents, type TEvent } from "fabric";
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
import { LayerType } from "@/liveblocks.config";
import { cn } from "@/lib/utils";
import { shallow, useMutation, useStorage } from "@liveblocks/react";

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

  console.log("object changed....", obj.id);

  /**
   * How should i update the control values
   * when live state changes?
   */

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

export const FabricObjectList = () => {
  /**
   * This list will only be re-rendered
   * either when new objects are added
   * or existing objects are removed
   */
  const objs = useFabricObjects();
  console.log("updating fabric object list...");

  return (
    <ul className="[&>*:not(:last-child)]:mb-2">
      {objs.map((obj) => (
        <li key={obj.id}>
          <FabricObjectListItem obj={obj} />
        </li>
      ))}
    </ul>
  );
};
