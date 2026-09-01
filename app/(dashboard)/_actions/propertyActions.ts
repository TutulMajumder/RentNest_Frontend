"use server";

import { BACKEND_URL } from "@/lib/backend-url";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";

import type { ActionResult, FieldError } from "@/lib/types";

export type PropertyState = ActionResult<{ id: string }> | null;

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

function parseBody(formData: FormData) {
  const sizeSqft = formData.get("sizeSqft") as string | null;
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
    bedrooms: Number(formData.get("bedrooms")),
    bathrooms: Number(formData.get("bathrooms")),
    ...(sizeSqft ? { sizeSqft: Number(sizeSqft) } : {}),
    address: formData.get("address"),
    city: formData.get("city"),
    division: formData.get("division"),
    categoryId: formData.get("categoryId"),
    availabilityStatus: formData.get("availabilityStatus") || "AVAILABLE",
    amenities: JSON.parse((formData.get("amenities") as string) || "[]"),
    images: JSON.parse((formData.get("images") as string) || "[]"),
  };
}

function fail(result: {
  message?: string;
  errorDetails?: unknown;
}): PropertyState {
  return {
    success: false,
    message: result?.message ?? "Something went wrong",
    errorDetails: Array.isArray(result?.errorDetails)
      ? (result.errorDetails as FieldError[])
      : undefined,
  };
}

export const createPropertyAction = async (
  _prev: PropertyState,
  formData: FormData,
): Promise<PropertyState> => {
  try {
    const res = await authedFetch("/api/landlord/properties", {
      method: "POST",
      body: JSON.stringify(parseBody(formData)),
    });
    const result = await res.json();
    if (!res.ok || !result?.success) return fail(result);
    updateTag("properties");
    revalidatePath("/dashboard/landlord/properties");
    return {
      success: true,
      message: "Property created",
      data: { id: result.data.id },
    };
  } catch {
    return { success: false, message: "Cannot reach the server. Try again." };
  }
};

export const updatePropertyAction = async (
  _prev: PropertyState,
  formData: FormData,
): Promise<PropertyState> => {
  const id = formData.get("id") as string;
  try {
    const res = await authedFetch(`/api/landlord/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(parseBody(formData)),
    });
    const result = await res.json();
    if (!res.ok || !result?.success) return fail(result);
    updateTag("properties");
    updateTag(`property:${id}`);
    revalidatePath("/dashboard/landlord/properties");
    return { success: true, message: "Property updated", data: { id } };
  } catch {
    return { success: false, message: "Cannot reach the server. Try again." };
  }
};

/** Availability toggle + delete — return a plain result for the list UI. */
export async function setAvailabilityAction(
  id: string,
  status: "AVAILABLE" | "UNAVAILABLE",
): Promise<ActionResult> {
  try {
    const res = await authedFetch(`/api/landlord/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify({ availabilityStatus: status }),
    });
    const result = await res.json();
    if (!res.ok || !result?.success)
      return { success: false, message: result?.message ?? "Update failed" };
    updateTag("properties");
    revalidatePath("/dashboard/landlord/properties");
    return { success: true, message: "Availability updated" };
  } catch {
    return { success: false, message: "Cannot reach the server." };
  }
}

export async function deletePropertyAction(id: string): Promise<ActionResult> {
  try {
    const res = await authedFetch(`/api/landlord/properties/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (!res.ok || !result?.success)
      return { success: false, message: result?.message ?? "Delete failed" };
    updateTag("properties");
    revalidatePath("/dashboard/landlord/properties");
    return { success: true, message: "Property removed" };
  } catch {
    return { success: false, message: "Cannot reach the server." };
  }
}
