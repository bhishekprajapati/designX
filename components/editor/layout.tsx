"use client";

import type { FC, HTMLProps, ReactNode } from "react";
import { ResizablePanel, ResizablePanelGroup } from "@ui/resizable";
import { ScrollArea } from "@ui/scroll-area";
import { cn } from "@/lib/utils";

type EditorLayoutProps = {
  children: ReactNode;
  renderTopBar?: () => ReactNode;
};

type TEditorLayout = FC<EditorLayoutProps> & {
  AssestPanel: FC<{
    children: ReactNode;
  }>;

  ControlPanel: FC<{
    children: ReactNode;
  }>;

  Canvas: FC<{
    children: ReactNode;
  }>;

  Floating: FC<
    {
      children: ReactNode;
    } & HTMLProps<HTMLDivElement>
  >;
};

export const EditorLayout: TEditorLayout = ({ children, renderTopBar }) => {
  if (!renderTopBar) {
    return (
      <div className="w-dvw h-dvh overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {children}
        </ResizablePanelGroup>
      </div>
    );
  }

  return (
    <div className="w-dvw h-dvh overflow-hidden">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel
          minSize={6}
          maxSize={6}
          order={1}
          className="border-b border-border"
        >
          {renderTopBar()}
        </ResizablePanel>
        <ResizablePanel maxSize={94} order={2}>
          <ResizablePanelGroup direction="horizontal">
            {children}
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

EditorLayout.AssestPanel = ({ children }) => {
  return (
    <ResizablePanel className="h-full" maxSize={15} order={1}>
      <div className="h-full relative">
        <ScrollArea className="h-full">{children}</ScrollArea>
      </div>
    </ResizablePanel>
  );
};

EditorLayout.ControlPanel = ({ children }) => {
  return (
    <ResizablePanel maxSize={15} order={3}>
      <div className="h-full relative z-50">
        <ScrollArea className="h-full">{children}</ScrollArea>
      </div>
    </ResizablePanel>
  );
};

EditorLayout.Canvas = ({ children }) => {
  return (
    <ResizablePanel order={2}>
      <div className="overflow-hidden h-full relative z-30 border-r-2 border-l-2">
        {children}
      </div>
    </ResizablePanel>
  );
};

EditorLayout.Floating = ({ children, className, ...props }) => {
  return (
    <div className={cn(className, "!absolute")} {...props}>
      {children}
    </div>
  );
};
