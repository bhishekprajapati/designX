import { ToolContext } from "@/contexts/tool-provider";
import { useContext } from "react";

export default function useTools() {
  const ctx = useContext(ToolContext);
  if (!ctx) {
    throw Error("Must be called inside ToolProvider");
  }
  return ctx;
}
