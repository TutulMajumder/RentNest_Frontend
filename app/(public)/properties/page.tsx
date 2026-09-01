import type { Metadata } from "next";

import { PropertyGrid } from "@/components/shared/property-grid";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { PAGE_SIZE } from "@/lib/constants";
import { getCategories } from "@/service/categories";
import { getProperties, type PropertyQuery } from "@/service/properties";
import { PropertyFilters } from "./_components/property-filters";

export const metadata: Metadata = {
  title: "Browse properties",
  description: "Search and filter rental properties across Bangladesh.",
};

type SearchParams = Record<string, string | string[] | undefined>;

const str = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const query: PropertyQuery = {
    searchTerm: str(sp.searchTerm),
    division: str(sp.division),
    categoryId: str(sp.categoryId),
    minPrice: str(sp.minPrice),
    maxPrice: str(sp.maxPrice),
    bedrooms: str(sp.bedrooms),
    amenities: str(sp.amenities),
    sortBy: str(sp.sortBy),
    sortOrder: str(sp.sortOrder) as "asc" | "desc" | undefined,
    page: str(sp.page) ?? "1",
    limit: PAGE_SIZE,
  };

  const [{ data, meta }, categories] = await Promise.all([
    getProperties(query),
    getCategories(),
  ]);

  const totalPages = meta.totalPage ?? Math.ceil(meta.total / PAGE_SIZE);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        Browse properties
      </h1>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <PropertyFilters categories={categories} />

        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {meta.total} {meta.total === 1 ? "property" : "properties"} found
          </p>
          <PropertyGrid properties={data} />
          <PaginationBar
            page={Number(query.page) || 1}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}
