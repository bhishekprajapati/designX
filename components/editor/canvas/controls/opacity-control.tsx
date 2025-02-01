"use client";

import { InputControl } from "@ui/input";
import { useActivatedObject, useCanvas } from "@/hooks/use-fabric";
import { z } from "zod";

const OpacityControl = () => {
  const canvas = useCanvas();
  const obj = useActivatedObject();

  return (
    <InputControl
      defaultValue={obj.opacity * 100}
      validation={{
        schema: z.coerce.number().gte(0).lte(100),
        onSuccess: (opacity) => {
          obj.opacity = opacity / 100;
          canvas.requestRenderAll();
        },
        onError: ({ setValue, defaultValue, lastValidatedValue }) => {
          if (lastValidatedValue) {
            setValue(lastValidatedValue);
          } else if (defaultValue) {
            setValue(defaultValue);
          }
        },
      }}
      transformer={{
        to: (value) => `${value}%`,
        from: (value) => value.replace("%", ""),
      }}
      leftElement={
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            className="fill-secondary-foreground"
            fillRule="evenodd"
            d="M8 7h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1M6 8a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zm8.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M13 10.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-2 2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-2 2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1.5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-2a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m.5 1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m2-4a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-.5 2.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m.5 1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"
            clipRule="evenodd"
          />
        </svg>
      }
    />
  );
};

export default OpacityControl;
