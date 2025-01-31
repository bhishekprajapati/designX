"use client";

import { useActivatedObject, useCanvas } from "@/hooks/use-fabric";
import { InputControl } from "@ui/input";
import { z } from "zod";

const CornerRadiusControl = () => {
  const obj = useActivatedObject();
  const canvas = useCanvas();

  return (
    <InputControl
      defaultValue={0}
      validation={{
        schema: z.coerce.number().gte(0).lte(Number.MAX_VALUE),
        onSuccess(r) {
          obj.set({
            rx: r,
            ry: r,
          });
          canvas.requestRenderAll();
        },
        onError({ setValue, defaultValue, lastValidatedValue }) {
          if (lastValidatedValue) {
            setValue(lastValidatedValue);
          } else if (defaultValue) {
            setValue(defaultValue);
          }
        },
      }}
      leftElement={
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            className="fill-secondary-foreground"
            fillRule="evenodd"
            d="M12.478 8H15.5a.5.5 0 0 1 0 1h-3c-.708 0-1.21 0-1.601.032-.386.032-.622.092-.807.186a2 2 0 0 0-.874.874c-.094.185-.154.42-.186.807C9 11.29 9 11.792 9 12.5v3a.5.5 0 0 1-1 0v-3.022c0-.681 0-1.223.036-1.66.036-.448.113-.83.291-1.18a3 3 0 0 1 1.311-1.311c.35-.178.732-.255 1.18-.291C11.254 8 11.796 8 12.477 8"
            clipRule="evenodd"
          ></path>
        </svg>
      }
    />
  );
};

export default CornerRadiusControl;
