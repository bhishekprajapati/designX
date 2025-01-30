"use client";

import { FocusEventHandler } from "react";
import { useState } from "react";
import { FabricObjectProps, SerializedObjectProps, ObjectEvents } from "fabric";
import { FabricObject } from "fabric";
import { Circle as IconCircle, Eye, EyeClosed, Square } from "lucide-react";

import { Button, buttonVariants } from "@ui/button";

import { useActiveObject, useCanvas } from "@/hooks/use-fabric";
import { useLayerObjects, useSelected } from "@/hooks/use-fabric";
import { LayerType } from "@/liveblocks.config";
import { cn } from "@/lib/utils";
import { useMutation, useStorage } from "@liveblocks/react";

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
}

FabricObject.customProperties = ["name", "id"];

type LayerProps = {
  isSelected: boolean;
  isVisible: boolean;
  name: string;
  type: LayerType;
  onNameChange: (name: string) => void;
  onVisibilityChange: (visible: boolean) => void;
  onSelect: () => void;
};

const Layer = (props: LayerProps) => {
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

type LayerListItemProps = {
  layer: FabricObject<
    Partial<FabricObjectProps>,
    SerializedObjectProps,
    ObjectEvents
  >;
};

const LayerListItem = (props: LayerListItemProps) => {
  const { layer } = props;
  const canvas = useCanvas();
  const selectedLayers = useSelected();
  const [, setActiveObject] = useActiveObject();

  const updateName = useMutation(
    ({ storage }, name: string) => {
      const liveLayers = storage.get("fabricCanvas").get("layers");
      const liveLayerObject = liveLayers.find(
        (liveLayer) => liveLayer.get("id") === layer.id
      );
      if (!liveLayerObject) return false;
      liveLayerObject.set("name", name);
      layer.name = name;
      return true;
    },
    [layer]
  );

  const handleNameChange = (name: string) => {
    const isSuccess = updateName(name);
    isSuccess &&
      canvas.fire("object:modified", {
        target: layer,
      });
  };

  const handleSelection = (obj: typeof layer) => {
    setActiveObject(obj);
  };

  const handleVisibilityChange = (visible: boolean) => {
    layer.visible = visible;
    canvas.fire("object:modified", { target: layer });
    canvas.requestRenderAll();
  };

  return (
    <Layer
      type={layer.type}
      name={layer.name}
      isVisible={layer.visible}
      isSelected={selectedLayers.has(layer.id)}
      onNameChange={handleNameChange}
      onSelect={() => handleSelection(layer)}
      onVisibilityChange={handleVisibilityChange}
    />
  );
};

export const LayerList = () => {
  const layers = useLayerObjects({
    events: {
      "object:added": true,
      "object:modified": true,
      "object:removed": true,
    },
  });

  return (
    <ul className="[&>*:not(:last-child)]:mb-2">
      {layers.map((layer) => (
        <li key={layer.id}>
          <LayerListItem layer={layer} />
        </li>
      ))}
    </ul>
  );
};
