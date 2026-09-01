import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getMyPayments } from "@/service/payments";
import type { PaymentStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Payments" };

const badge: Record<PaymentStatus, string> = {
  COMPLETED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  FAILED: "bg-destructive/10 text-destructive",
};

export default async function PaymentsPage() {
  const payments = await getMyPayments();

  return (
    <>
      <PageHeader
        title="Payments"
        description="Every payment you've made through RentNest."
      />

      {payments.length === 0 ? (
        <EmptyState
          title="No payments yet"
          description="Payments appear here once you pay for an approved rental."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {p.rentalRequest?.property?.title ?? "—"}
                  </TableCell>
                  <TableCell>{formatCurrency(p.amount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="ghost"
                      className={`border-transparent ${badge[p.status]}`}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(p.paidAt ?? p.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
