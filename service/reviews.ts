import "server-only";

import { apiFetch } from "./api-client";
import type { Review } from "@/lib/types";

/** Landlord: reviews across my properties (backend returns a bare array). */
export async function getLandlordReviews() {
  const { data } = await apiFetch<Review[]>("/api/landlord/reviews", {
    cache: "no-store",
  });
  return Array.isArray(data) ? data : [];
}
