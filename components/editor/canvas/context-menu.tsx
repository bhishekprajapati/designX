"use client";

import React, { useContext } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useActiveObject } from "@/hooks/use-fabric";
import { FabricCanvasContext } from "@/contexts/fabric-provider";

const CanvasContextMenuContent = () => {
  const canvas = useContext(FabricCanvasContext);
  if (!canvas) return <></>;
  const [active] = useActiveObject();
  if (active) {
    return <ContextMenuContent></ContextMenuContent>;
  }
  return <></>;
};

type CanvasContextMenuProps = {
  children: React.ReactNode;
};

const CanvasContextMenu = (props: CanvasContextMenuProps) => {
  const { children } = props;

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <CanvasContextMenuContent />
    </ContextMenu>
  );
};

export default CanvasContextMenu;
