"use client";

import type { FC, HTMLProps, ReactNode } from "react";
import { Panel, PanelGroup } from "react-resizable-panels";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        <PanelGroup direction="horizontal">{children}</PanelGroup>
      </div>
    );
  }

  return (
    <div className="w-dvw h-dvh overflow-hidden">
      <PanelGroup direction="vertical">
        <Panel minSize={5} maxSize={5} order={1}>
          {renderTopBar()}
        </Panel>
        <Panel maxSize={95} order={2}>
          <PanelGroup direction="horizontal">{children}</PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};

EditorLayout.AssestPanel = ({ children }) => {
  return (
    <Panel className="h-full" maxSize={15} order={1}>
      <div className="h-full relative">
        <ScrollArea className="h-full">{children}</ScrollArea>
      </div>
    </Panel>
  );
};

EditorLayout.ControlPanel = ({ children }) => {
  return (
    <Panel maxSize={15} order={3}>
      <div className="h-full relative z-50">
        <ScrollArea className="h-full">{children}</ScrollArea>
      </div>
    </Panel>
  );
};

EditorLayout.Canvas = ({ children }) => {
  return (
    <Panel order={2}>
      <div className="overflow-hidden h-full relative z-30 border-r-2 border-l-2">
        {children}
      </div>
    </Panel>
  );
};

EditorLayout.Floating = ({ children, className, ...props }) => {
  return (
    <div className={cn(className, "!absolute")} {...props}>
      {children}
    </div>
  );
};
