"use client";

import { UserButton } from "@clerk/nextjs";

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

const ControlPanel = () => {
  return (
    <div>
      <ColabControls />
      <Separator />
      <div className="p-2">
        <ModeToggle />
      </div>
    </div>
  );
};

export default ControlPanel;
