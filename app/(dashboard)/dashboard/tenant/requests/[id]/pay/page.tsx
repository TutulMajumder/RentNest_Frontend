import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ApiError } from "@/service/api-client";
import { getRentalRequest } from "@/service/rentals";
import { PayButton } from "../../../../../_components/pay-button";

export const metadata: Metadata = { title: "Pay for rental" };

export default async function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let request;
  try {
    request = await getRentalRequest(id);
  } catch (err) {
    if (
      err instanceof ApiError &&
      (err.status === 404 || err.status === 400 || err.status === 403)
    ) {
      notFound();
    }
    throw err;
  }

  const rent = request.property ? formatCurrency(request.property.price) : "—";

  return (
    <div className="max-w-lg">
      <Link
        href="/dashboard/tenant/requests"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to requests
      </Link>

      <PageHeader title="Complete your payment" />

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{request.property?.title}</p>
              <p className="text-sm text-muted-foreground">
                {request.property?.address}, {request.property?.city}
              </p>
            </div>
            <RentalStatusBadge status={request.status} />
          </div>

          <Separator />

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Move-in date</dt>
              <dd>{formatDate(request.moveInDate)}</dd>
            </div>
            {request.moveOutDate && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Move-out date</dt>
                <dd>{formatDate(request.moveOutDate)}</dd>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <dt>Amount due</dt>
              <dd className="text-primary">{rent}</dd>
            </div>
          </dl>

          <Separator />

          {request.status === "APPROVED" ? (
            <>
              <PayButton rentalRequestId={request.id} label="Proceed to payment" />
              <p className="text-xs text-muted-foreground">
                You&apos;ll be redirected to Stripe to complete payment securely.
              </p>
            </>
          ) : request.payment?.status === "COMPLETED" ||
            request.status === "ACTIVE" ? (
            <p className="text-sm text-emerald-600">
              This rental is already paid and active.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              This request isn&apos;t ready for payment yet (status:{" "}
              {request.status}).
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
