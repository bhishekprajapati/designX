import { Liveblocks } from "@liveblocks/node";

export const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SK,
});

export const getRoomsByUserId = async (id: string) => {
  const rooms = await liveblocks.getRooms({
    userId: id,
  });
  return rooms;
};
