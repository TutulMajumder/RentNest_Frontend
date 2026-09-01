"use server";

import { BACKEND_URL } from "@/lib/backend-url";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";

import type { ActionResult, FieldError } from "@/lib/types";

export type RentalRequestState = ActionResult | null;

export const createRentalRequestAction = async (
  _prev: RentalRequestState,
  formData: FormData,
): Promise<RentalRequestState> => {
  const propertyId = formData.get("propertyId") as string;
  const moveInDate = formData.get("moveInDate") as string;
  const moveOutDate = (formData.get("moveOutDate") as string | null)?.trim();
  const message = (formData.get("message") as string | null)?.trim();

  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return { success: false, message: "Please sign in to continue." };

  try {
    const res = await fetch(`${BACKEND_URL}/api/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        propertyId,
        moveInDate,
        ...(moveOutDate ? { moveOutDate } : {}),
        ...(message ? { message } : {}),
      }),
    });
    const result = await res.json();

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message ?? "Could not submit request",
        errorDetails: Array.isArray(result?.errorDetails)
          ? (result.errorDetails as FieldError[])
          : undefined,
      };
    }
  } catch {
    return { success: false, message: "Cannot reach the server. Try again." };
  }

  updateTag("properties");
  return { success: true, message: "Rental request submitted" };
};
