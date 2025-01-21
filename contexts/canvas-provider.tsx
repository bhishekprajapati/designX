"use client";

import { Canvas } from "fabric";
import { createContext, useState } from "react";

export type TCanvasContext = {
  setCanvas: (canvas: Canvas | null) => void;
  getCanvas: () => Canvas | null;
};
export const CanvasContext = createContext<TCanvasContext | null>(null);

export type CanvasProviderProps = {
  children: React.ReactNode;
};

const CanvasProvider = (props: CanvasProviderProps) => {
  const { children } = props;
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);

  return (
    <CanvasContext.Provider
      value={{
        getCanvas: () => fabricCanvas,
        setCanvas: setFabricCanvas,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;
