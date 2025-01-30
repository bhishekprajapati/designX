"use client";

import { useContext } from "react";
import { EditorLayoutContext } from "@/contexts/editor-layout-provider";

export const useEditorLayout = () => {
  const ctx = useContext(EditorLayoutContext);
  if (!ctx) {
    throw Error("Must be called inside EditorLayoutContext");
  }
  return ctx;
};
