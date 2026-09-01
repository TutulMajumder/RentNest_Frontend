import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ClipboardList, Inbox, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import {
  getAdminProperties,
  getAdminRentals,
  getAdminUsers,
} from "@/service/admin";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const [users, properties, rentals, pendingRentals] = await Promise.all([
    getAdminUsers({ limit: 1 }),
    getAdminProperties({ limit: 1 }),
    getAdminRentals({ limit: 1 }),
    getAdminRentals({ limit: 1, status: "PENDING" }),
  ]);

  const count = (m: { total: number; count?: number }) => m.count ?? m.total;

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Platform health and moderation."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={count(users.meta)} icon={Users} />
        <StatCard
          label="Total properties"
          value={count(properties.meta)}
          icon={Building2}
        />
        <StatCard
          label="Rental requests"
          value={count(rentals.meta)}
          icon={ClipboardList}
        />
        <StatCard
          label="Pending requests"
          value={count(pendingRentals.meta)}
          icon={Inbox}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/dashboard/admin/users", label: "Manage users" },
          { href: "/dashboard/admin/properties", label: "Review properties" },
          { href: "/dashboard/admin/rentals", label: "Review rentals" },
        ].map((l) => (
          <Button key={l.href} asChild variant="outline" className="h-auto py-4">
            <Link href={l.href}>{l.label}</Link>
          </Button>
        ))}
      </div>
    </>
  );
}
