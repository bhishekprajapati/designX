"use client";

import Draggable from "react-draggable";
import { HexColorPicker } from "react-colorful";

import {
  FloatingModal,
  FloatingModalClose,
  FloatingModalContent,
  FloatingModalHeader,
  FloatingModalTitle,
  FloatingModalTrigger,
} from "./ui/floating-modal";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ChangeEventHandler } from "react";

const isValidHex = (hex: string): boolean => {
  return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex); // (case-insensitive)
};

type ColorPickerProps = {
  color?: string;
  onChange?: (color: string) => void;
};

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const handleColorChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!onChange) return;
    const color = `#${e.target.value}`;
    if (!isValidHex(color)) return;
    onChange(color);
  };

  return (
    <FloatingModal>
      <Input
        className="uppercase"
        value={color?.slice(1)}
        onChange={handleColorChange}
        leftElement={
          <FloatingModalTrigger
            className="w-6 h-5 rounded-md"
            style={{ backgroundColor: color }}
          />
        }
      />

      <Draggable handle=".drag-handle">
        <FloatingModalContent>
          <FloatingModalHeader className="drag-handle">
            <FloatingModalTitle className="text-sm">Custom</FloatingModalTitle>
            <FloatingModalClose />
          </FloatingModalHeader>
          <HexColorPicker
            color={color}
            onChange={onChange}
            className="color-picker"
          />
          <Separator />
          <div className="p-4 flex items-center gap-4">
            <Label className="">HEX</Label>
            <Input
              className="uppercase"
              size={12}
              value={color?.slice(1)}
              onChange={handleColorChange}
            />
          </div>
        </FloatingModalContent>
      </Draggable>
    </FloatingModal>
  );
};

export default ColorPicker;
