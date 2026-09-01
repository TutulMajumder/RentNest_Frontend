import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .optional()
    .or(z.literal("")),
});

export type CategoryValues = z.infer<typeof categorySchema>;
