"use server";

import { nanoid } from "nanoid";
import { auth } from "@clerk/nextjs/server";
import { liveblocks } from "@/lib/liveblocks";
import { revalidatePath } from "next/cache";

export const createDesign = async (name: string) => {
  try {
    const user = await auth();

    if (!user.userId) {
      return {
        ok: false as const,
        error: {
          name: "unauthenticated",
        },
      };
    }

    const room = await liveblocks.createRoom(nanoid(), {
      defaultAccesses: [],
      usersAccesses: {
        [user.userId]: ["room:write"],
      },
      metadata: {
        name,
      },
    });

    revalidatePath("/files", "page");

    return {
      ok: true as const,
      data: room,
    };
  } catch (err) {
    return {
      ok: false as const,
      error: {
        name: "unknown",
      },
    };
  }
};

export const getDesigns = async () => {
  return [];
};
