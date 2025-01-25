import { Card, CardHeader } from "@/components/ui/card";
import { getRoomsByUserId } from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateDesignButton } from "./_components/buttons";

type DesignFileProps = {
  name: string;
  url: string;
};

const DesignFile = (props: DesignFileProps) => {
  const { name, url } = props;

  return (
    <Card>
      <CardHeader>{name}</CardHeader>
      <a href={url}>open</a>
    </Card>
  );
};

export default async function files() {
  const user = await auth();

  if (!user.userId) redirect("/");
  const rooms = await getRoomsByUserId(user.userId);

  if (!rooms.data.length)
    return (
      <>
        No files found <CreateDesignButton />
      </>
    );

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold">Designs</h2>
        <CreateDesignButton />
      </div>

      <ul className="grid grid-cols-3 gap-8">
        {rooms.data.map((room) => (
          <li key={room.id}>
            <DesignFile
              name={room.metadata.name as string}
              url={`/design/${room.id}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
