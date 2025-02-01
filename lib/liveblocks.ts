import { Liveblocks } from "@liveblocks/node";

export const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SK,
});

export const getRoomState = async (id: string) => {
  const state = await liveblocks.getStorageDocument(id, "json");
  return state;
};
