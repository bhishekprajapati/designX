"use client";

import { createContext, useState } from "react";

export type TEditorLayoutContext = {
  isCollapsed: boolean;
  setIsCollapsed: (is: boolean) => void;
};

export const EditorLayoutContext = createContext<TEditorLayoutContext | null>(
  null
);

type EditorLayoutProviderProps = {
  children: React.ReactNode;
};
const EditorLayoutProvider = (props: EditorLayoutProviderProps) => {
  const { children } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <EditorLayoutContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed: (is) => setIsCollapsed(is),
      }}
    >
      {children}
    </EditorLayoutContext.Provider>
  );
};

export default EditorLayoutProvider;
