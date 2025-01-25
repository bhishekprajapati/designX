import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const me = await currentUser();
    return NextResponse.json({
      ok: true,
      user: me
        ? {
            id: me.id,
            firstName: me.firstName,
          }
        : null,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
    });
  }
};
