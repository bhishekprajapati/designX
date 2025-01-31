"use client";

import ColorPicker from "@/components/color-picker";
import { useActivatedObject, useCanvas } from "@/hooks/use-fabric";
import { Color } from "@/utils/colors";

const FillControl = () => {
  const canvas = useCanvas();
  const obj = useActivatedObject();

  const handleFillChange = (fill: string) => {
    obj.set("fill", fill);
    canvas.requestRenderAll();
  };

  const color = Color.toHex(obj?.fill === null ? "#000" : obj.fill.toString());
  return <ColorPicker color={color ?? "#000"} onChange={handleFillChange} />;
};

export default FillControl;
