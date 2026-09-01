import "server-only";

import { apiFetchList } from "./api-client";
import type { Category } from "@/lib/types";

export async function getCategories() {
  const { data } = await apiFetchList<Category>("/api/categories", {
    query: { limit: 100 },
    auth: false,
    next: { revalidate: 300, tags: ["categories"] },
  });
  return data.filter((c) => c.isActive);
}
