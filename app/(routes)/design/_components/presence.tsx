"use client";

import { Fragment, useEffect, useMemo } from "react";
import { useOthers, useSelf, useUpdateMyPresence } from "@liveblocks/react";
import useCanvas from "@/hooks/use-canvas";
import Cursor from "@/components/cursor";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const PresenceCursors = () => {
  const canvas = useCanvas();
  const update = useUpdateMyPresence();
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

  const getColor = (index: number) => {
    if (index < 0) return COLORS[0];
    if (index < COLORS.length) return COLORS[index];
    return COLORS[index % COLORS.length];
  };

  return (
    <>
      {others.map(({ connectionId, presence }) => (
        <Fragment key={connectionId}>
          {presence.cursor && (
            <Cursor
              x={presence.cursor.x}
              y={presence.cursor.y}
              color={getColor(connectionId)}
            />
          )}
        </Fragment>
      ))}
    </>
  );
};

export const PresenceAvatars = () => {
  const others = useOthers();
  const self = useSelf();

  const users = useMemo(() => [self, ...others], [self, others]);
  const classes = cn("flex items-center");

  return (
    <ul className={classes}>
      {users.map((user, idx) => {
        if (!user) return <></>;
        const { id, info } = user;
        return (
          <li
            className="relative"
            key={id}
            style={{
              transform: `translateX(-${idx / 2}rem)`,
              zIndex: users.length - idx,
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="w-8 h-8 border rounded-full">
                    <AvatarImage src={info.avatar} />
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {[
                      info.firstName,
                      info.lastName,
                      self?.id === id ? " (You)" : "",
                    ].join(" ")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        );
      })}
    </ul>
  );
};
