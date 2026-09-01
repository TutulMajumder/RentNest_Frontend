"use server";

import { BACKEND_URL } from "@/lib/backend-url";

import { cookies } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";

import type { ActionResult, FieldError } from "@/lib/types";

export type CategoryState = ActionResult | null;

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

function done(message: string): ActionResult {
  updateTag("categories");
  revalidatePath("/dashboard/admin/categories");
  return { success: true, message };
}

function fail(result: { message?: string; errorDetails?: unknown }): ActionResult {
  return {
    success: false,
    message: result?.message ?? "Something went wrong",
    errorDetails: Array.isArray(result?.errorDetails)
      ? (result.errorDetails as FieldError[])
      : undefined,
  };
}

export const upsertCategoryAction = async (
  _prev: CategoryState,
  formData: FormData,
): Promise<CategoryState> => {
  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string).trim();
  const description = (formData.get("description") as string | null)?.trim();

  const body = { name, ...(description ? { description } : {}) };

  try {
    const res = await authedFetch(
      id ? `/api/categories/${id}` : "/api/categories",
      { method: id ? "PATCH" : "POST", body: JSON.stringify(body) },
    );
    const result = await res.json();
    if (!res.ok || !result?.success) return fail(result);
  } catch {
    return { success: false, message: "Cannot reach the server." };
  }

  return done(id ? "Category updated" : "Category created");
};

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const res = await authedFetch(`/api/categories/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (!res.ok || !result?.success) return fail(result);
  } catch {
    return { success: false, message: "Cannot reach the server." };
  }
  return done("Category removed");
}
