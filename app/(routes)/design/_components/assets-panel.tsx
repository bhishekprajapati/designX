"use client";

import { Canvas } from "fabric";
import { Eye, EyeOff } from "lucide-react";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import useCanvas from "@/hooks/use-canvas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LayersProps = {
  canvas: Canvas;
};

const Layers = ({}: LayersProps) => {
  const layers = useStorage(({ fabricCanvas }) => fabricCanvas.layers);

  const updateVisibility = useMutation(
    ({ storage }, id: string, visible: boolean) => {
      storage
        .get("fabricCanvas")
        .get("layers")
        .find((layer) => layer.get("id") === id)
        ?.update({
          visible,
        });
    },
    [layers]
  );

  return (
    <div className="p-4">
      <h4 className="mb-4 text-sm font-semibold leading-none">Layers</h4>
      <ul>
        {layers.map((layer) => (
          <li
            key={layer.id}
            className={cn("ps-4 pe-2 rounded-sm flex items-center gap-4", {
              "bg-gray-100 dark:bg-slate-900": false,
            })}
          >
            {layer.name}
            <Button
              className="ms-auto"
              variant="ghost"
              size="icon"
              onClick={() => updateVisibility(layer.id, !layer.visible)}
            >
              {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AssetsPanel = () => {
  const canvas = useCanvas();

  if (!canvas) return <></>;

  return (
    <div>
      <Layers canvas={canvas} />
    </div>
  );
};

export default AssetsPanel;
