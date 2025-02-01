"use client";

import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@ui/button";
import useToaster from "@/hooks/use-toaster";
import { createRoom } from "@/app/actions/room";

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
  const toaster = useToaster();
  const router = useRouter();
  const create = useCreateMuatation();
  const handler = () =>
    create.mutate(undefined, {
      onError: (err) => toaster.error(err.message),
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
