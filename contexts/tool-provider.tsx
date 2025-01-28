"use client";

import {
  useState,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type TToolContext = {
  mode: "move" | "hand";
  setMode: Dispatch<SetStateAction<TToolContext["mode"]>>;
};

export const ToolContext = createContext<TToolContext | null>(null);

export type ToolProviderProps = {
  children: React.ReactNode;
};

const ToolProvider = ({ children }: ToolProviderProps) => {
  const [mode, setMode] = useState<TToolContext["mode"]>("move");

  return (
    <ToolContext.Provider
      value={{
        mode,
        setMode,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
};

export default ToolProvider;
