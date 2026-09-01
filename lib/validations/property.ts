import { z } from "zod";

const numeric = (msg: string) =>
  z
    .string()
    .min(1, msg)
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, "Enter a number");

export const propertySchema = z.object({
  title: z.string().trim().min(4, "Title must be at least 4 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  price: numeric("Enter a monthly rent").refine(
    (v) => Number(v) > 0,
    "Rent must be greater than 0",
  ),
  bedrooms: numeric("Enter the number of bedrooms"),
  bathrooms: numeric("Enter the number of bathrooms"),
  sizeSqft: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || Number(v) > 0, "Enter a valid size"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  city: z.string().trim().min(2, "Enter a city"),
  division: z.string().trim().min(2, "Select a division"),
  categoryId: z.string().min(1, "Select a category"),
  availabilityStatus: z.enum(["AVAILABLE", "UNAVAILABLE"]),
  amenities: z.array(z.string()),
  images: z
    .array(z.string().trim())
    .refine(
      (arr) => arr.some((s) => s.length > 0),
      "Add at least one image URL",
    )
    .refine(
      (arr) =>
        arr
          .filter(Boolean)
          .every((s) => /^https?:\/\/.+/.test(s)),
      "Image URLs must start with http(s)://",
    ),
});

export type PropertyValues = z.infer<typeof propertySchema>;
