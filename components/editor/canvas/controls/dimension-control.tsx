"use client";

import { Input, InputControl } from "@ui/input";
import { useActivatedObject, useCanvas } from "@/hooks/use-fabric";
import { number, z } from "zod";

const DimensionControl = () => {
  const canvas = useCanvas();
  const obj = useActivatedObject();

  const handleChange = (type: "width" | "height", length: number) => {
    obj.set({
      width: type === "width" ? length : obj.width,
      height: type === "height" ? length : obj.height,
    });
    obj.setCoords();
    canvas.requestRenderAll();
    obj.fire("modified", { target: obj });
  };

  return (
    <div className="flex gap-2 items-center">
      <InputControl
        defaultValue={obj.width}
        validation={{
          schema: z.coerce.number().gte(1).max(Number.MAX_SAFE_INTEGER),
          onSuccess(length) {
            handleChange("width", length);
          },
          onError({ setValue }) {
            setValue(50);
          },
        }}
        leftElement={
          <span className="text-xs text-secondary-foreground">W</span>
        }
      />
      <InputControl
        defaultValue={obj.height}
        validation={{
          schema: z.coerce.number().gte(1).max(Number.MAX_SAFE_INTEGER),
          onSuccess(length) {
            handleChange("height", length);
          },
          onError({ setValue }) {
            setValue(50);
          },
        }}
        leftElement={
          <span className="text-xs text-secondary-foreground">H</span>
        }
      />
    </div>
  );
};

export default DimensionControl;
