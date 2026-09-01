import "server-only";

import { apiFetch, apiFetchList } from "./api-client";
import type { Property } from "@/lib/types";

export type PropertyQuery = {
  searchTerm?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  division?: string;
  city?: string;
  categoryId?: string;
  bedrooms?: string | number;
  amenities?: string; // JSON stringified array
  availabilityStatus?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: string | number;
  limit?: string | number;
};

export function getProperties(query: PropertyQuery = {}) {
  return apiFetchList<Property>("/api/properties", {
    query: query as Record<string, string | number | undefined>,
    auth: false,
    next: { revalidate: 60, tags: ["properties"] },
  });
}

export async function getProperty(id: string) {
  const { data } = await apiFetch<Property>(`/api/properties/${id}`, {
    auth: false,
    next: { revalidate: 60, tags: ["properties", `property:${id}`] },
  });
  return data;
}
