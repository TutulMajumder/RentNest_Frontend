import { z } from "zod";

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const rentalRequestSchema = z
  .object({
    moveInDate: z
      .string()
      .min(1, "Choose a move-in date")
      .refine((v) => new Date(v) >= today(), {
        message: "Move-in date cannot be in the past",
      }),
    moveOutDate: z.string().optional().or(z.literal("")),
    message: z
      .string()
      .trim()
      .max(500, "Keep your message under 500 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (v) => !v.moveOutDate || new Date(v.moveOutDate) > new Date(v.moveInDate),
    { path: ["moveOutDate"], message: "Move-out must be after move-in" },
  );

export type RentalRequestValues = z.infer<typeof rentalRequestSchema>;
