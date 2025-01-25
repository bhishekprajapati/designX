"use client";

import { useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { useOthers, useRoom, useUpdateMyPresence } from "@liveblocks/react";

import InviteForm from "./invite-form";
import useCanvas from "@/hooks/use-canvas";

import Cursor from "@/components/cursor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ModeToggle } from "@/components/mode-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import UsersAccesses from "./users-accesses";

const MyPresence = () => {
  const canvas = useCanvas();
  const update = useUpdateMyPresence();

  useEffect(() => {
    if (!canvas) return;
    canvas.on("mouse:move", ({ scenePoint }) =>
      update({
        cursor: {
          x: scenePoint.x,
          y: scenePoint.y,
        },
      })
    );
  }, [canvas]);

  return <></>;
};

const OthersPresence = () => {
  const COLORS = [
    "#E57373",
    "#9575CD",
    "#4FC3F7",
    "#81C784",
    "#FFF176",
    "#FF8A65",
    "#F06292",
    "#7986CB",
  ] as const;

  const others = useOthers();

  const getColor = (index: number) => {
    if (index < 0) return COLORS[0];
    if (index < COLORS.length) return COLORS[index];
    return COLORS[index % COLORS.length];
  };

  return (
    <ul className="flex items-center gap-4">
      {others.map(({ connectionId, presence }) => (
        <li key={connectionId}>
          {connectionId}
          {presence.cursor && (
            <Cursor
              x={presence.cursor.x}
              y={presence.cursor.y}
              color={getColor(connectionId)}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

const ColabControls = () => {
  return (
    <div className="p-2 flex items-center justify-between">
      <UserButton />
      {/* <Dialog>
        <DialogTrigger>
          <Button size="sm">
            Share
            <Share2 size={8} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this file</DialogTitle>
          </DialogHeader>
          <InviteForm />
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

const ControlPanel = () => {
  return (
    <ScrollArea className="h-full rounded-md border">
      <ColabControls />
      <Separator />
      <div className="p-2">
        <OthersPresence />
        <MyPresence />
        <ModeToggle />
      </div>
    </ScrollArea>
  );
};

export default ControlPanel;
