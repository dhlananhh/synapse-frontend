import { z } from "zod";

// Update User Profile
export const updateUserProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(50, "Username is too long.")
    .optional(),
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(50)
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(50)
    .optional(),
  bio: z
    .string()
    .max(255, "Bio must be less than 255 characters.")
    .optional(),
  location: z
    .string()
    .max(100, "Location is too long.")
    .optional(),
});

export type UpdateUserProfileSchema = z.infer<
  typeof updateUserProfileSchema
>;
