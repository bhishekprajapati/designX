import Design from "@/components/design";
import { liveblocks } from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Params = {
  id: string;
};

export default async function design({ params }: { params: Params }) {
  const user = await auth();

  if (!user.userId) redirect("/");
  const room = await liveblocks.getRoom(params.id);

  if (user.userId in room.usersAccesses)
    return <Design room={{ id: room.id }} />;
  return <>forbidden</>;
}
