import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { SearchInput } from "@/components/shared/search-input";
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGE_SIZE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { getAdminProperties } from "@/service/admin";

export const metadata: Metadata = { title: "All Properties" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(str(sp.page)) || 1;

  const { data, meta } = await getAdminProperties({
    page,
    limit: PAGE_SIZE,
    searchTerm: str(sp.searchTerm),
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const totalPages = meta.totalPage ?? Math.ceil(meta.total / PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="All Properties"
        description={`${meta.total} listings across the platform`}
      />

      <div className="mb-4">
        <Suspense fallback={null}>
          <SearchInput
            placeholder="Search title, city, address…"
            className="w-full sm:w-72"
          />
        </Suspense>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No properties found" />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Landlord</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Listing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/properties/${p.id}`}
                      className="hover:underline"
                    >
                      {p.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.landlord?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.city}, {p.division}
                  </TableCell>
                  <TableCell>{formatCurrency(p.price)}</TableCell>
                  <TableCell>
                    <AvailabilityBadge status={p.availabilityStatus} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.isActive ? "secondary" : "outline"}>
                      {p.isActive ? "Active" : "Removed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PaginationBar page={page} totalPages={totalPages} />
    </>
  );
}
