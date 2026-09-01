"use server";

import { BACKEND_URL } from "@/lib/backend-url";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/types";

async function authedFetch(path: string, init: RequestInit) {
  const token = (await cookies()).get("accessToken")?.value;
  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
}

export async function setUserStatusAction(
  userId: string,
  status: "ACTIVE" | "BLOCKED",
): Promise<ActionResult> {
  try {
    const res = await authedFetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok || !result?.success) {
      return { success: false, message: result?.message ?? "Update failed" };
    }
  } catch {
    return { success: false, message: "Cannot reach the server." };
  }

  revalidatePath("/dashboard/admin/users");
  return {
    success: true,
    message: status === "BLOCKED" ? "User banned" : "User unbanned",
  };
}
