import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";

export default function Loading() {
  return (
    <>
      <PageHeader title="Loading…" />
      <TableSkeleton cols={6} />
    </>
  );
}
