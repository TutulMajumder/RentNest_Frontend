import type { Metadata } from "next";
import { Suspense } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGE_SIZE, ROLE_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getAdminUsers } from "@/service/admin";
import { AdminUserActions } from "../../../_components/admin-user-actions";

export const metadata: Metadata = { title: "User Management" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(str(sp.page)) || 1;

  const { data, meta } = await getAdminUsers({
    page,
    limit: PAGE_SIZE,
    searchTerm: str(sp.searchTerm),
    role: str(sp.role),
    status: str(sp.status),
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const totalPages =
    meta.totalPages ?? meta.totalPage ?? Math.ceil(meta.total / PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="User Management"
        description={`${meta.total} registered users`}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Suspense fallback={null}>
          <SearchInput
            placeholder="Search name or email…"
            className="w-full sm:w-64"
          />
          <FilterSelect
            paramKey="role"
            placeholder="All roles"
            className="w-36"
            options={[
              { value: "TENANT", label: "Tenant" },
              { value: "LANDLORD", label: "Landlord" },
              { value: "ADMIN", label: "Admin" },
            ]}
          />
          <FilterSelect
            paramKey="status"
            placeholder="All statuses"
            className="w-36"
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "BLOCKED", label: "Blocked" },
            ]}
          />
        </Suspense>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No users match your filters" />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>{ROLE_LABEL[u.role]}</TableCell>
                  <TableCell>
                    <Badge
                      variant="ghost"
                      className={
                        u.status === "BLOCKED"
                          ? "border-transparent bg-destructive/10 text-destructive"
                          : "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400"
                      }
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(u.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <AdminUserActions user={u} />
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
