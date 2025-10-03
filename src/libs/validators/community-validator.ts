import * as z from "zod";


// create community
export const CreateCommunitySchema = z.object({
  name: z.string()
    .min(3, "Community name must be at least 3 characters long.")
    .max(50, "Community name cannot exceed 50 characters.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Community name can only contain letters, numbers, underscores, and hyphens."),
  description: z.string()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters."),
  status: z.enum([ "ACTIVE", "SUSPENDED", "DELETED" ]),
  isPrivate: z.boolean(),
  isNSFW: z.boolean(),
});

export type TCreateCommunitySchema = z.infer<typeof CreateCommunitySchema>;


// update community details
export const UpdateCommunityDetailsSchema = z.object({
  name: z.string()
    .min(3, "Community name must be at least 3 characters long.")
    .max(50, "Community name cannot exceed 50 characters.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Community name can only contain letters, numbers, underscores, and hyphens."),
  description: z.string()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters."),
  isPrivate: z.boolean(),
  isNSFW: z.boolean(),
  moderationMode: z.boolean(),
})

export type TUpdateCommunityDetailsSchema = z.infer<typeof UpdateCommunityDetailsSchema>;
