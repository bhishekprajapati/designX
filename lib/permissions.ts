import { RoomData } from "@liveblocks/node";
import { liveblocks } from "./liveblocks";

export const canWrite = (userId: string, room: RoomData): boolean => {
  const accesses = room.usersAccesses[userId];
  // @ts-expect-error
  return accesses.includes("room:write");
};

export const isOwner = canWrite;

export const canCreate = async (userId: string) => {
  const rooms = await liveblocks.getRooms({
    userId,
  });
  if (rooms.data.length > 2) return false;
  return true;
};
