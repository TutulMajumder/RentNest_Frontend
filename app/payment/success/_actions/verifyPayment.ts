"use server";

import { BACKEND_URL } from "@/lib/backend-url";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";

import type { PaymentStatus } from "@/lib/types";

export type VerifyResult =
  | {
      ok: true;
      status: PaymentStatus;
      amount: string;
      propertyTitle: string;
      rentalRequestId: string;
    }
  | { ok: false; message: string };

export async function verifyPaymentAction(
  sessionId: string,
): Promise<VerifyResult> {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return { ok: false, message: "Please sign in to view this payment." };

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/payments/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      },
    );
    const json = await res.json();

    if (!res.ok || !json?.success) {
      return { ok: false, message: json?.message ?? "Could not verify payment" };
    }

    const p = json.data;
    if (p.status === "COMPLETED") {
      updateTag("properties"); // availability changed to RENTED
    }

    return {
      ok: true,
      status: p.status,
      amount: String(p.amount),
      propertyTitle: p.rentalRequest?.property?.title ?? "Rental payment",
      rentalRequestId: p.rentalRequestId,
    };
  } catch {
    return { ok: false, message: "Cannot reach the server. Try again." };
  }
}
