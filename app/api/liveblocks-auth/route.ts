import { liveblocks } from "@/lib/liveblocks";
import { currentUser } from "@clerk/nextjs/server";

export async function POST() {
  const user = await currentUser();
  if (!user) return new Response(null, { status: 403 });
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.id,
      groupIds: [],
    },
    {
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    }
  );
  return new Response(body, { status });
}
