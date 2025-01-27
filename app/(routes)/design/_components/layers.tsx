"use client";

import { Canvas } from "fabric";
import { Circle, Eye, EyeClosed, Square } from "lucide-react";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSelected } from "@/hooks/use-fabric";
import { ChangeEventHandler, useState } from "react";
import { cn } from "@/lib/utils";
import { TLiveLayerData } from "@/liveblocks.config";

type LayerProps = {
  type: LayerType;
  name: string;
  isSelected: boolean;
  isVisible: boolean;
  onNameChange: (name: string) => void;
  onVisibilityChange: (isVisible: boolean) => void;
};

const Layer = (props: LayerProps) => {
  const {
    type,
    isSelected,
    isVisible,
    name,
    onNameChange,
    onVisibilityChange,
  } = props;

  const [allowEditing, setAllowEditing] = useState(false);

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newName = e.target.value.trim();
    if (!newName.length) return;
    if (newName === name) return;
    onNameChange(newName);
  };

  return (
    <div className={isVisible ? "" : "opacity-50"}>
      <div
        className={buttonVariants({
          variant: allowEditing || isSelected ? "secondary" : "ghost",
          size: "lg",
          className: "w-full !px-3 group",
        })}
      >
        <span>
          {type === "Rect" && <Square className="scale-75" size={8} />}
          {type === "Circle" && <Circle className="scale-75" size={8} />}
        </span>
        {allowEditing ? (
          <input
            defaultValue={name}
            className="p-1 ps-2 w-full focus:outline-none rounded-lg"
            onBlur={() => setAllowEditing(false)}
            onChange={handleNameChange}
            spellCheck="false"
            autoComplete="false"
            autoFocus
          />
        ) : (
          <span
            className="text-sm cursor-pointer"
            onDoubleClick={() => setAllowEditing(true)}
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
            onClick={() => onVisibilityChange(!isVisible)}
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

type LayersProps = {
  canvas: Canvas;
};

const Layers = ({}: LayersProps) => {
  const selected = useSelected();
  const layers = useStorage(({ fabricCanvas }) => fabricCanvas.layers);

  const patchLayerById = useMutation(
    ({ storage }, id: string, patch: Partial<TLiveLayerData>) => {
      storage
        .get("fabricCanvas")
        .get("layers")
        .find((layer) => layer.get("id") === id)
        ?.update(patch);
    },
    [layers]
  );

  return (
    <ul className="[&>*:not(:last-child)]:mb-2">
      {layers.map((layer) => (
        <li key={layer.id}>
          <Layer
            name={layer.name}
            type={layer.type}
            isVisible={layer.visible}
            isSelected={selected.has(layer.id)}
            onVisibilityChange={(visible) =>
              patchLayerById(layer.id, { visible })
            }
            onNameChange={(name) => patchLayerById(layer.id, { name })}
          />
        </li>
      ))}
    </ul>
  );
};

export default Layers;
