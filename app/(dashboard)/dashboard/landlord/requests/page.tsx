import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { PAGE_SIZE } from "@/lib/constants";
import { getLandlordRequests } from "@/service/rentals";
import { LandlordRequestsTable } from "../../../_components/landlord-requests-table";

export const metadata: Metadata = { title: "Rental Requests" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function LandlordRequestsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const page = Number(str((await searchParams).page)) || 1;
  const filters = { page, limit: PAGE_SIZE };

  const initialData = await getLandlordRequests({
    page,
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <>
      <PageHeader
        title="Rental Requests"
        description="Approve or reject requests on your properties."
      />
      <LandlordRequestsTable filters={filters} initialData={initialData} />
    </>
  );
}
