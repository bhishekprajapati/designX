"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "@/lib/liveblocks";
import { revalidatePath } from "next/cache";
import { privateRouter } from "./router";

export const createRoom = privateRouter
  .branch()
  .run(async ({ context }, res) => {
    const { user } = context;
    const room = await liveblocks.createRoom(nanoid(), {
      defaultAccesses: [],
      usersAccesses: {
        [user.userId]: ["room:write"],
      },
      metadata: {
        name: "untitled",
        type: "design",
      },
    });

    await liveblocks.initializeStorageDocument(room.id, {
      liveblocksType: "LiveObject",
      data: {
        fabricCanvas: {
          liveblocksType: "LiveObject",
          data: {
            name: "untitled",
            snapshot:
              "https://images.unsplash.com/photo-1612538498456-e861df91d4d0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=annie-spratt-BcGoZXjyPzA-unsplash.jpg&w=640",
            background: "gray",
            layers: {
              liveblocksType: "LiveList",
              data: [],
            },
          },
        },
      },
    });

    revalidatePath("/files", "page");
    return res.data(room);
  });

export const getOwnerRooms = privateRouter
  .branch()
  .run(async ({ context }, res) => {
    const FALLBACK_IMG =
      "https://images.unsplash.com/photo-1612538498456-e861df91d4d0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=annie-spratt-BcGoZXjyPzA-unsplash.jpg&w=640";
    const { user } = context;
    const userId = user.userId;
    const rooms = await liveblocks.getRooms({
      userId,
    });

    const list = await Promise.all(
      rooms.data.map((room) => {
        return liveblocks
          .getStorageDocument(room.id, "json")
          .then(({ fabricCanvas }) => {
            const img = Object.hasOwn(fabricCanvas, "snapshot")
              ? fabricCanvas["snapshot"]
              : FALLBACK_IMG;
            return {
              id: room.id,
              img,
              name: room.metadata["name"] as string,
              createdAt: room.createdAt,
              lastEditedAt: room.lastConnectionAt,
            };
          });
      })
    );

    return res.data(list);
  });
