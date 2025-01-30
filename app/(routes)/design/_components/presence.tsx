"use client";

import { nanoid } from "nanoid";
import { Fragment, useEffect, useMemo, useRef } from "react";
import { useOthers, useSelf, useUpdateMyPresence } from "@liveblocks/react";
import { useCanvas } from "@/hooks/use-fabric";
import Cursor from "@/components/cursor";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const randPresenceId = () => nanoid(5);

export const PresenceCursors = () => {
  const canvas = useCanvas();
  const update = useUpdateMyPresence();
  const RAND_ID_REF = useRef(randPresenceId());

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
        randId: RAND_ID_REF.current,
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
        const randId =
          presence.randId === undefined ? randPresenceId() : presence.randId;

        return (
          <li
            className="relative"
            key={`${id}-${randId}`}
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
