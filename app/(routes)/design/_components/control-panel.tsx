"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { PresenceAvatars } from "./presence";
import { useMutation, useStorage } from "@liveblocks/react";
import { useState } from "react";
import ColorPicker from "@/components/color-picker";
import { Input } from "@/components/ui/input";

const ColabControls = () => {
  return (
    <div className="p-2 flex items-center justify-between">
      <PresenceAvatars />
      <Dialog>
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PageControls = () => {
  const background =
    useStorage(({ fabricCanvas }) => fabricCanvas.background) ?? "gray";

  const setColor = useMutation(({ storage }, color: string) => {
    const fabric = storage.get("fabricCanvas");
    fabric.update({
      background: color,
    });
  }, []);

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">Page</h3>
      <div className="flex gap-4 items-center">
        <ColorPicker color={background} onChange={setColor} />
      </div>
    </div>
  );
};

const ControlPanel = () => {
  return (
    <div>
      <ColabControls />
      <Separator />
      <div className="p-2">
        <PageControls />
      </div>
      <Separator />
      <div className="p-2">
        <ModeToggle />
      </div>
    </div>
  );
};

export default ControlPanel;
