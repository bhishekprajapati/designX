"use client";

import { createRoom } from "@/app/actions/room";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const useCreateMuatation = () => {
  const mutation = useMutation({
    mutationKey: ["create-room"],
    mutationFn: async () => {
      const res = await createRoom(null);
      if (res.success) return res.data;
      throw Error(res.error.message);
    },
  });
  return mutation;
};

export const CreateDesignButton = () => {
  const router = useRouter();
  const create = useCreateMuatation();
  const handler = () =>
    create.mutate(undefined, {
      onSuccess: ({ id }) => {
        router.push(`/design/${id}` as any);
      },
    });

  return (
    <Button onClick={handler} disabled={create.isPending}>
      <Plus size={16} />
      New Design
    </Button>
  );
};
