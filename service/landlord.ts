import "server-only";

import { apiFetchList } from "./api-client";
import type { Property } from "@/lib/types";

export type LandlordPropertyQuery = {
  searchTerm?: string;
  availabilityStatus?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: string | number;
  limit?: string | number;
};

/** Landlord: my own listings (includes `_count.rentalRequests` / `_count.reviews`). */
export function getLandlordProperties(query: LandlordPropertyQuery = {}) {
  return apiFetchList<Property>("/api/landlord/properties", {
    query: query as Record<string, string | number | undefined>,
    cache: "no-store",
  });
}
