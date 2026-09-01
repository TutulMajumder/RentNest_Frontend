"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { RentalRequest } from "@/lib/types";
import { ReviewDialog } from "./review-dialog";

export function TenantRequestActions({ request }: { request: RentalRequest }) {
  if (request.status === "APPROVED") {
    return (
      <Button size="sm" asChild>
        <Link href={`/dashboard/tenant/requests/${request.id}/pay`}>
          Pay now
        </Link>
      </Button>
    );
  }

  if (request.status === "COMPLETED" && !request.review) {
    return (
      <ReviewDialog
        rentalRequestId={request.id}
        propertyTitle={request.property?.title ?? "this property"}
      />
    );
  }

  if (request.status === "ACTIVE") {
    return (
      <span className="text-xs text-muted-foreground">Rental in progress</span>
    );
  }

  return <span className="text-xs text-muted-foreground">—</span>;
}
