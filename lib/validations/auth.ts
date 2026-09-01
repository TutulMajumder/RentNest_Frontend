import { z } from "zod";

/** Mirrors the backend `auth.validation.ts` Zod rules. */
export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    role: z.enum(["TENANT", "LANDLORD"], {
      message: "Select whether you're renting or listing",
    }),
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .min(10, "Phone number must be at least 10 digits")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export const profileSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    phone: z
      .string()
      .trim()
      .min(10, "Phone number must be at least 10 digits")
      .optional()
      .or(z.literal("")),
    oldPassword: z.string().optional().or(z.literal("")),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine((v) => !v.newPassword || !!v.oldPassword, {
    path: ["oldPassword"],
    message: "Enter your current password to set a new one",
  });

export type ProfileValues = z.infer<typeof profileSchema>;
