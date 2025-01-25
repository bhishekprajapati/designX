"use server";

import { liveblocks } from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export const getUsersAccesses = async (id: string) => {
  try {
    const user = await auth();
    if (!user.userId)
      return {
        ok: false as const,
        error: {
          name: "unauthenticated",
        },
      };

    const room = await liveblocks.getRoom(id);
    return {
      ok: true as const,
      data: room.usersAccesses,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false as const,
      error: {
        name: "unknown",
      },
    };
  }
};
