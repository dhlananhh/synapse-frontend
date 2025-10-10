import { z } from "zod";

export const PostSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long.",
    })
    .max(128, {
      message:
        "Title must be no longer than 128 characters.",
    }),
  communityId: z.string(),
  content: z.any(),
  flairId: z.string().optional(),
});

export type TPostSchema = z.infer<typeof PostSchema>;
