import { Badge } from "@/components/ui/badge";
import { AVAILABILITY_STATUS, RENTAL_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AvailabilityStatus, RentalStatus } from "@/lib/types";

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  const { label, className } = RENTAL_STATUS[status];
  return (
    <Badge variant="ghost" className={cn("border-transparent", className)}>
      {label}
    </Badge>
  );
}

export function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const { label, className } = AVAILABILITY_STATUS[status];
  return (
    <Badge variant="ghost" className={cn("border-transparent", className)}>
      {label}
    </Badge>
  );
}
