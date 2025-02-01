import FileCard from "@/components/file-card";
import { CreateDesignButton } from "./_components/buttons";
import { getOwnerRooms } from "@/app/actions/room";

export default async function files() {
  const res = await getOwnerRooms(null);
  if (!res.success) {
    return <>an error occured while loading. {res.error.message}</>;
  }

  const rooms = res.data;
  if (!rooms.length)
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

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {rooms.map((room) => (
          <li key={room.id}>
            <FileCard
              img={room.img}
              name={room.name}
              url={`/design/${room.id}`}
              createdAt={room.createdAt}
              lastEditedAt={room.lastEditedAt}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
