import { getUsersAccesses } from "@/app/actions/acl";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type UsersAccessesProps = {
  roomId: string;
};

const UsersAccesses = async ({ roomId }: UsersAccessesProps) => {
  const res = await getUsersAccesses(roomId);

  if (!res.ok) {
    return <>Error occured: {res.error.name}</>;
  }

  const accesses = res.data;

  return (
    <div>
      <h3 className="mb-4">Who has access</h3>
      {Object.entries(accesses).map(([userId, access]) => (
        <div key={userId} className="flex items-center gap-2">
          {userId}
          {/* <Avatar className="w-8 h-8">
            <AvatarImage src={self.info.avatar} alt="" />
          </Avatar> */}
          {/* <div>{self.info.firstName}(You)</div>
          <Badge className="ms-auto" variant="outline">
            owner
          </Badge> */}
        </div>
      ))}
    </div>
  );
};
export default UsersAccesses;
