"use client";

import { cn } from "@/lib/utils";
import { useSyncStatus } from "@liveblocks/react";
import { Save } from "lucide-react";
import { Badge, type BadgeProps } from "../ui/badge";

type EditorSyncStatusProps = BadgeProps;

const EditorSyncStatus = ({ className, ...restProps }: BadgeProps) => {
  const status = useSyncStatus({
    smooth: true,
  });

  return (
    <Badge
      variant="outline"
      className={cn("px-2 py-1", className)}
      {...restProps}
    >
      <span
        className={cn("flex items-center gap-2 !text-secondary-foreground")}
      >
        {status === "synchronizing" ? "saving" : "saved"}
        {status === "synchronizing" ? "..." : <Save size={12} />}
      </span>
    </Badge>
  );
};

export default EditorSyncStatus;
