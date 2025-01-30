import { getRoomState, liveblocks } from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DesignEditor from "@editor/index";
import { FabricCanvasHydrationState } from "@/liveblocks.config";

type Params = {
  id: string;
};

export default async function design({ params }: { params: Params }) {
  const user = await auth();

  if (!user.userId) redirect("/");
  const room = await liveblocks.getRoom(params.id);

  if (user.userId in room.usersAccesses) {
    const state = await getRoomState(room.id);
    const initialState: FabricCanvasHydrationState = {
      background: state.fabricCanvas.background,
      // TODO: fix this type error
      // @ts-expect-error
      objects: state.fabricCanvas.layers,
    };
    return (
      <DesignEditor initialCanvasState={initialState} room={{ id: room.id }} />
    );
  }

  return <>forbidden</>;
}
