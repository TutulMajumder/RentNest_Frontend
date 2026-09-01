"use server";

import { BACKEND_URL } from "@/lib/backend-url";

import { cookies } from "next/headers";
import type { MeResponse } from "@/lib/types";

/**
 * Current user for the logged-in session.
 * Per-user data, so it is never cached (`no-store`) — a shared cache key
 * would let one user be served another user's profile.
 */
export const getMe = async (): Promise<MeResponse> => {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const result = await res.json();

    if (!res.ok || !result?.success) {
      return { success: false, message: result?.message ?? "Session expired" };
    }
    return result as MeResponse;
  } catch {
    return { success: false, message: "Cannot reach the server" };
  }
};
