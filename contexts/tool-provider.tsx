"use client";

import useCanvas from "@/hooks/use-canvas";
import { Shape, shapes } from "@/lib/fabric";
import {
  useState,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type TToolContext = {
  mode: "move" | "hand";
  setMode: Dispatch<SetStateAction<TToolContext["mode"]>>;
  shapes: ReturnType<typeof useShapes>;
};

export const ToolContext = createContext<TToolContext | null>(null);

export type ToolProviderProps = {
  children: React.ReactNode;
};

const useShapes = () => {
  const canvas = useCanvas();

  function add<T extends Shape>(
    shape: T,
    options: Parameters<(typeof shapes)[T]>["0"]
  ) {
    if (!canvas) return;

    canvas.defaultCursor = "crosshair";

    canvas.once("mouse:down", ({ pointer }) => {
      const obj = shapes[shape]({
        top: pointer.y,
        left: pointer.x,
        ...options,
      });

      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.defaultCursor = "default";
    });
  }

  return { add };
};

const ToolProvider = ({ children }: ToolProviderProps) => {
  const [mode, setMode] = useState<TToolContext["mode"]>("move");
  const shapes = useShapes();

  return (
    <ToolContext.Provider
      value={{
        mode,
        setMode,
        shapes,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
};

export default ToolProvider;
