import { string, z } from "zod";

export const fileAccessSchema = z.enum(["read", "write"]);

export const inviteFormSchema = z.object({
  email: z.string({ message: "Provide a valid email address" }).trim().email(),
  access: fileAccessSchema,
});

export const roomMetaSchema = z.object({
  name: string().min(2).max(64),
  image: string().url(),
});
