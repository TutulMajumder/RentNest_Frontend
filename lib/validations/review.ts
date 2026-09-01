import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number({ message: "Select a rating" })
    .int()
    .min(1, "Select a rating")
    .max(5),
  comment: z
    .string()
    .trim()
    .min(5, "Comment must be at least 5 characters")
    .max(500, "Keep your comment under 500 characters")
    .optional()
    .or(z.literal("")),
});

export type ReviewValues = z.infer<typeof reviewSchema>;
