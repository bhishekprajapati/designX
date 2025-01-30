"use client";

import { useOthers, useSelf, useUpdateMyPresence } from "@liveblocks/react";
import { Fragment, useEffect, useMemo } from "react";

import Cursor from "@/components/cursor";
import { Avatar, AvatarImage } from "@ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/tooltip";
import { useCanvas } from "@/hooks/use-fabric";

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

  const users = useMemo(
    () => [self, ...others].filter((user) => user !== null),
    [self, others]
  );

  return (
    <ul className="flex items-center">
      {users.map((user, idx) => {
        const { id, info, presence } = user;
        return (
          <li
            className="relative"
            key={`${id}-${presence.randId}`}
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
