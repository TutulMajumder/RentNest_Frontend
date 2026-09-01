import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Inbox, TrendingUp, Wallet } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getLandlordProperties } from "@/service/landlord";
import { getLandlordRequests } from "@/service/rentals";

export const metadata: Metadata = { title: "Landlord Dashboard" };

export default async function LandlordDashboardPage() {
  const [{ meta: propMeta }, { data: requests }] = await Promise.all([
    getLandlordProperties({ limit: 1 }),
    getLandlordRequests({ limit: 100, sortBy: "createdAt", sortOrder: "desc" }),
  ]);

  const pending = requests.filter((r) => r.status === "PENDING").length;
  const active = requests.filter((r) => r.status === "ACTIVE").length;
  const earnings = requests
    .filter((r) => r.payment?.status === "COMPLETED")
    .reduce((sum, r) => sum + Number(r.payment?.amount ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Landlord Dashboard"
        description="Your portfolio at a glance."
        action={
          <Button asChild>
            <Link href="/dashboard/landlord/properties/new">Add property</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Properties" value={propMeta.total} icon={Building2} />
        <StatCard label="Pending requests" value={pending} icon={Inbox} />
        <StatCard label="Active rentals" value={active} icon={TrendingUp} />
        <StatCard
          label="Total earnings"
          value={formatCurrency(earnings)}
          icon={Wallet}
        />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Recent requests</h2>
          <Link
            href="/dashboard/landlord/requests"
            className="text-sm font-medium text-primary hover:underline"
          >
            Manage all
          </Link>
        </div>
        {requests.length === 0 ? (
          <Card>
            <CardContent className="text-sm text-muted-foreground">
              No rental requests yet.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="divide-y p-0">
              {requests.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 px-5 py-3 first:pt-5 last:pb-5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {r.property?.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.tenant?.name} · move-in {formatDate(r.moveInDate)}
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
