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
import { Canvas } from "fabric";

const CanvasContextMenuContent = ({ canvas }: { canvas: Canvas }) => {
  const [active] = useActiveObject();

  if (active) {
    return (
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() =>
            canvas.fire("object:remove", {
              target: active,
            })
          }
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    );
  }

  return <></>;
};

type CanvasContextMenuProps = {
  children: React.ReactNode;
};

const CanvasContextMenu = (props: CanvasContextMenuProps) => {
  const { children } = props;
  const canvas = useContext(FabricCanvasContext);

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      {canvas && <CanvasContextMenuContent canvas={canvas} />}
    </ContextMenu>
  );
};

export default CanvasContextMenu;
