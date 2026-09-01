import "server-only";

import { apiFetchList } from "./api-client";
import type { CurrentUser, Property, RentalRequest } from "@/lib/types";

type Query = Record<string, string | number | undefined>;

export function getAdminUsers(query: Query = {}) {
  return apiFetchList<CurrentUser>("/api/admin/users", {
    query,
    cache: "no-store",
  });
}

export function getAdminProperties(query: Query = {}) {
  return apiFetchList<Property>("/api/admin/properties", {
    query,
    cache: "no-store",
  });
}

export function getAdminRentals(query: Query = {}) {
  return apiFetchList<RentalRequest>("/api/admin/rentals", {
    query,
    cache: "no-store",
  });
}
