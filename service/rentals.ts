import "server-only";

import { apiFetch, apiFetchList } from "./api-client";
import type { RentalRequest } from "@/lib/types";

export type RentalQuery = {
  status?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: string | number;
  limit?: string | number;
};

/** Tenant: my rental requests. */
export function getMyRentals(query: RentalQuery = {}) {
  return apiFetchList<RentalRequest>("/api/rentals", {
    query: query as Record<string, string | number | undefined>,
    cache: "no-store",
  });
}

/** Tenant: a single rental request. */
export async function getRentalRequest(id: string) {
  const { data } = await apiFetch<RentalRequest>(`/api/rentals/${id}`, {
    cache: "no-store",
  });
  return data;
}

/** Landlord: requests on my properties. */
export function getLandlordRequests(query: RentalQuery = {}) {
  return apiFetchList<RentalRequest>("/api/landlord/requests", {
    query: query as Record<string, string | number | undefined>,
    cache: "no-store",
  });
}
