"use server";

import { BACKEND_URL } from "@/lib/backend-url";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import type { ActionResult, FieldError } from "@/lib/types";

export type ReviewState = ActionResult | null;

export const createReviewAction = async (
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> => {
  const rentalRequestId = formData.get("rentalRequestId") as string;
  const rating = Number(formData.get("rating"));
  const comment = (formData.get("comment") as string | null)?.trim();

  if (!rating || rating < 1 || rating > 5) {
    return {
      success: false,
      message: "Select a rating between 1 and 5",
      errorDetails: [{ field: "rating", message: "Select a rating" }],
    };
  }

  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return { success: false, message: "Please sign in to continue." };

  try {
    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rentalRequestId,
        rating,
        ...(comment ? { comment } : {}),
      }),
    });
    const result = await res.json();

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message ?? "Could not submit review",
        errorDetails: Array.isArray(result?.errorDetails)
          ? (result.errorDetails as FieldError[])
          : undefined,
      };
    }
  } catch {
    return { success: false, message: "Cannot reach the server. Try again." };
  }

  revalidatePath("/dashboard/tenant/requests");
  return { success: true, message: "Review submitted. Thank you!" };
};
