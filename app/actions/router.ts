import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ActionRouter } from "next-action-router/server/index";

export const privateRouter = new ActionRouter({
  error: {
    codes: {
      "internal-server-error": "somehting went wrong",
    },
  },
}).use(async () => {
  const user = await auth();
  if (!user.userId) {
    redirect("/");
  }
  return {
    inputs: null,
    user,
  };
});
