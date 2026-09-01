import type { Metadata } from "next";
import { Star } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getLandlordReviews } from "@/service/reviews";

export const metadata: Metadata = { title: "Reviews" };

export default async function LandlordReviewsPage() {
  const reviews = await getLandlordReviews();

  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <>
      <PageHeader
        title="Reviews"
        description={
          avg
            ? `${avg} average across ${reviews.length} review${reviews.length === 1 ? "" : "s"}`
            : "Tenant reviews on your properties"
        }
      />

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Reviews appear after a tenant completes a rental."
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{r.property?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.tenant?.name} · {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <span className="text-amber-500">
                    {"★".repeat(r.rating)}
                    <span className="text-muted-foreground">
                      {"★".repeat(5 - r.rating)}
                    </span>
                  </span>
                </div>
                {r.comment && (
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
