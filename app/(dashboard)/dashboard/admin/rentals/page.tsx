import type { Metadata } from "next";
import { Suspense } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGE_SIZE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getAdminRentals } from "@/service/admin";

export const metadata: Metadata = { title: "All Rentals" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function AdminRentalsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(str(sp.page)) || 1;

  const { data, meta } = await getAdminRentals({
    page,
    limit: PAGE_SIZE,
    status: str(sp.status),
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const total = meta.count ?? meta.total;
  const totalPages = meta.totalPage ?? Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="All Rentals"
        description={`${total} rental requests across the platform`}
      />

      <div className="mb-4">
        <Suspense fallback={null}>
          <FilterSelect
            paramKey="status"
            placeholder="All statuses"
            className="w-40"
            options={[
              "PENDING",
              "APPROVED",
              "REJECTED",
              "ACTIVE",
              "COMPLETED",
              "CANCELLED",
            ].map((s) => ({ value: s, label: s }))}
          />
        </Suspense>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No rental requests found" />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Move-in</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    {r.property?.title ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.tenant?.name ?? "—"}
                  </TableCell>
                  <TableCell>{formatDate(r.moveInDate)}</TableCell>
                  <TableCell>{formatDate(r.createdAt)}</TableCell>
                  <TableCell>
                    <RentalStatusBadge status={r.status} />
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
