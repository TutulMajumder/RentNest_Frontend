"use server";

import { BACKEND_URL } from "@/lib/backend-url";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { ActionResult } from "@/lib/types";

export type PaymentState = ActionResult | null;

export const createPaymentSessionAction = async (
  _prev: PaymentState,
  formData: FormData,
): Promise<PaymentState> => {
  const rentalRequestId = formData.get("rentalRequestId") as string;

  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return { success: false, message: "Please sign in to continue." };

  let checkoutUrl: string | undefined;

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/payments/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rentalRequestId }),
      },
    );
    const result = await res.json();

    if (!res.ok || !result?.success || !result.data?.checkoutUrl) {
      return {
        success: false,
        message: result?.message ?? "Could not start checkout",
      };
    }
    checkoutUrl = result.data.checkoutUrl as string;
  } catch {
    return { success: false, message: "Cannot reach the server. Try again." };
  }

  redirect(checkoutUrl); // to Stripe Checkout — outside try/catch
};
