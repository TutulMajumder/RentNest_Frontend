"use client";

import Link from "next/link";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Paginated, RentalRequest } from "@/lib/types";
import {
  useLandlordRequests,
  useUpdateRequestStatus,
  type RequestFilters,
} from "@/hooks/use-landlord-requests";

export function LandlordRequestsTable({
  filters,
  initialData,
}: {
  filters: RequestFilters;
  initialData: Paginated<RentalRequest>;
}) {
  const { data } = useLandlordRequests(filters, initialData);
  const mutation = useUpdateRequestStatus(filters);

  const act = (id: string, status: RentalRequest["status"], label: string) =>
    mutation.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(label),
        onError: (e) =>
          toast.error(e instanceof Error ? e.message : "Update failed"),
      },
    );

  if (data.data.length === 0) {
    return (
      <EmptyState
        title="No rental requests"
        description="Requests from tenants on your properties will appear here."
      />
    );
  }

  const totalPages =
    data.meta.totalPage ??
    Math.ceil((data.meta.count ?? data.meta.total) / filters.limit);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Move-in</TableHead>
              <TableHead>Rent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <Link
                    href={`/properties/${r.propertyId}`}
                    className="font-medium hover:underline"
                  >
                    {r.property?.title ?? "—"}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.tenant?.name ?? "—"}
                </TableCell>
                <TableCell>{formatDate(r.moveInDate)}</TableCell>
                <TableCell>
                  {r.property ? formatCurrency(r.property.price) : "—"}
                </TableCell>
                <TableCell>
                  <RentalStatusBadge status={r.status} />
                </TableCell>
                <TableCell className="text-right">
                  {r.status === "PENDING" ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        disabled={mutation.isPending}
                        onClick={() =>
                          act(r.id, "APPROVED", "Request approved")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={mutation.isPending}
                        onClick={() =>
                          act(r.id, "REJECTED", "Request rejected")
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  ) : r.status === "ACTIVE" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={mutation.isPending}
                      onClick={() =>
                        act(r.id, "COMPLETED", "Rental marked completed")
                      }
                    >
                      Mark completed
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationBar page={filters.page} totalPages={totalPages} />
    </>
  );
}
