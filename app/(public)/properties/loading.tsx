import { PropertyGridSkeleton } from "@/components/shared/property-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_SIZE } from "@/lib/constants";

export default function PropertiesLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-8 w-56" />
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div>
          <Skeleton className="mb-4 h-4 w-40" />
          <PropertyGridSkeleton count={PAGE_SIZE} />
        </div>
      </div>
    </div>
  );
}
