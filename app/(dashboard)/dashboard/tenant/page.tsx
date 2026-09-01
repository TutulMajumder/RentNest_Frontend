import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, FileText, Home, Loader } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getMyPayments } from "@/service/payments";
import { getMyRentals } from "@/service/rentals";

export const metadata: Metadata = { title: "Tenant Dashboard" };

export default async function TenantDashboardPage() {
  const [{ data: rentals }, payments] = await Promise.all([
    getMyRentals({ limit: 100, sortBy: "createdAt", sortOrder: "desc" }),
    getMyPayments(),
  ]);

  const pending = rentals.filter((r) => r.status === "PENDING").length;
  const active = rentals.filter((r) => r.status === "ACTIVE").length;
  const totalSpent = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <>
      <PageHeader
        title="Tenant Dashboard"
        description="Your rental activity at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total requests" value={rentals.length} icon={FileText} />
        <StatCard label="Pending" value={pending} icon={Loader} />
        <StatCard label="Active rentals" value={active} icon={Home} />
        <StatCard
          label="Total spent"
          value={formatCurrency(totalSpent)}
          icon={CreditCard}
        />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Recent requests</h2>
          <Link
            href="/dashboard/tenant/requests"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {rentals.length === 0 ? (
          <Card>
            <CardContent className="text-sm text-muted-foreground">
              No requests yet.{" "}
              <Link href="/properties" className="text-primary hover:underline">
                Browse properties
              </Link>
              .
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="divide-y p-0">
              {rentals.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 px-5 py-3 first:pt-5 last:pb-5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {r.property?.title ?? "Property"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Move-in {formatDate(r.moveInDate)}
                    </p>
                  </div>
                  <RentalStatusBadge status={r.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
