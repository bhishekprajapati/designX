import { RoomData } from "@liveblocks/node";

export const canWrite = (userId: string, room: RoomData): boolean => {
  const accesses = room.usersAccesses[userId];
  // @ts-expect-error
  return accesses.includes("room:write");
};

export const isOwner = canWrite;
