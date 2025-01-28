"use client";

import { useCanvas } from "@/hooks/use-fabric";
import { Fragment } from "react";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { TLiveLayerData } from "@/liveblocks.config";
import { RectangleLayer } from "@/components/layers";
import { CircleLayer } from "@/components/layers/circle-layer";

const RenderLayers = () => {
  const canvas = useCanvas();
  const layers = useStorage(({ fabricCanvas }) => fabricCanvas.layers) ?? [];

  const modify = useMutation(({ storage }, layer: TLiveLayerData) => {
    const target = storage
      .get("fabricCanvas")
      .get("layers")
      .find((liveLayer) => liveLayer.get("id") === layer.id);

    target?.update(layer);
  }, []);

  return (
    <>
      {layers.map((layer) => (
        <Fragment key={layer.id}>
          {layer.type === "Rect" && (
            <RectangleLayer
              canvas={canvas}
              layer={layer}
              onModified={(state) => modify(state)}
            />
          )}
          {layer.type === "Circle" && (
            <CircleLayer
              canvas={canvas}
              layer={layer}
              onModified={(state) => modify(state)}
            />
          )}
        </Fragment>
      ))}
    </>
  );
};

export default RenderLayers;
