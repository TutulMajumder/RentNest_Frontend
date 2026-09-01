"use server";

import { BACKEND_URL } from "@/lib/backend-url";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import type { ActionResult, FieldError } from "@/lib/types";

export type ProfileState = ActionResult | null;

export const updateProfileAction = async (
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> => {
  const name = (formData.get("name") as string | null)?.trim();
  const phone = (formData.get("phone") as string | null)?.trim();
  const oldPassword = formData.get("oldPassword") as string | null;
  const newPassword = formData.get("newPassword") as string | null;

  const payload: Record<string, string> = {};
  if (name) payload.name = name;
  if (phone) payload.phone = phone;
  if (newPassword) {
    payload.oldPassword = oldPassword ?? "";
    payload.newPassword = newPassword;
  }

  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/auth/manage-profiles`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      },
    );
    const result = await res.json();

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message ?? "Update failed",
        errorDetails: Array.isArray(result?.errorDetails)
          ? (result.errorDetails as FieldError[])
          : undefined,
      };
    }
  } catch {
    return { success: false, message: "Cannot reach the server. Try again." };
  }

  revalidatePath("/dashboard/profile");
  return { success: true, message: "Profile updated" };
};
