import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
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
import { formatCurrency, formatDate } from "@/lib/utils";
import { getMyRentals } from "@/service/rentals";
import { TenantRequestActions } from "../../../_components/tenant-request-actions";

export const metadata: Metadata = { title: "My Requests" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function TenantRequestsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(str(sp.page)) || 1;

  const { data, meta } = await getMyRentals({
    page,
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const totalPages =
    meta.totalPage ?? Math.ceil((meta.count ?? meta.total) / PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="My Requests"
        description="Track the status of every rental request you've made."
      />

      {data.length === 0 ? (
        <EmptyState
          title="No rental requests yet"
          description="Browse properties and submit your first request."
          action={
            <Link
              href="/properties"
              className="text-sm font-medium text-primary hover:underline"
            >
              Browse properties
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Move-in</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {r.property ? (
                      <Link
                        href={`/properties/${r.propertyId}`}
                        className="font-medium hover:underline"
                      >
                        {r.property.title}
                      </Link>
                    ) : (
                      "—"
                    )}
                    <span className="block text-xs text-muted-foreground">
                      {r.property?.city}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(r.moveInDate)}</TableCell>
                  <TableCell>
                    {r.property ? formatCurrency(r.property.price) : "—"}
                  </TableCell>
                  <TableCell>
                    <RentalStatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <TenantRequestActions request={r} />
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
