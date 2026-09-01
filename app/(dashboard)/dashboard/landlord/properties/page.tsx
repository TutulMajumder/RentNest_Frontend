import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
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
import { getLandlordProperties } from "@/service/landlord";
import { LandlordPropertyActions } from "../../../_components/landlord-property-actions";

export const metadata: Metadata = { title: "My Properties" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function LandlordPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const page = Number(str((await searchParams).page)) || 1;
  const { data, meta } = await getLandlordProperties({
    page,
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const totalPages = meta.totalPage ?? Math.ceil(meta.total / PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="My Properties"
        description={`${meta.total} listing${meta.total === 1 ? "" : "s"}`}
        action={
          <Button asChild>
            <Link href="/dashboard/landlord/properties/new">Add property</Link>
          </Button>
        }
      />

      {data.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties yet"
          description="Create your first listing to start receiving rental requests."
          action={
            <Button asChild>
              <Link href="/dashboard/landlord/properties/new">Add property</Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.city}, {p.division}
                  </TableCell>
                  <TableCell>{formatCurrency(p.price)}</TableCell>
                  <TableCell>{p._count?.rentalRequests ?? 0}</TableCell>
                  <TableCell>
                    <AvailabilityBadge status={p.availabilityStatus} />
                  </TableCell>
                  <TableCell>
                    <LandlordPropertyActions property={p} />
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
