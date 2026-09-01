import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  MapPin,
  Ruler,
} from "lucide-react";

import { AvailabilityBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApiError } from "@/service/api-client";
import { getProperty } from "@/service/properties";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import { ImageGallery } from "../_components/image-gallery";
import { RequestToRent } from "../_components/request-to-rent";

async function load(id: string) {
  try {
    return await getProperty(id);
  } catch (err) {
    // 404 = gone, 400 = malformed id — both are "not found" to the visitor.
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
      notFound();
    }
    throw err;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const property = await getProperty(id);
    return { title: property.title, description: property.description.slice(0, 150) };
  } catch {
    return { title: "Property" };
  }
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await load(id);

  const facts = [
    { icon: BedDouble, label: `${property.bedrooms} bed` },
    { icon: Bath, label: `${property.bathrooms} bath` },
    ...(property.sizeSqft
      ? [{ icon: Ruler, label: `${property.sizeSqft} sqft` }]
      : []),
  ];

  const reviews = property.reviews ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <ImageGallery images={property.images} title={property.title} />

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {property.title}
              </h1>
              <AvailabilityBadge status={property.availabilityStatus} />
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {property.address}, {property.city}, {property.division},{" "}
              {property.country}
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-sm text-muted-foreground">
              {facts.map((f) => (
                <span key={f.label} className="flex items-center gap-1.5">
                  <f.icon className="size-4" />
                  {f.label}
                </span>
              ))}
              {property.category && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  {property.category.name}
                </span>
              )}
            </div>
          </div>

          <Separator />

          <section className="space-y-2">
            <h2 className="font-semibold">About this property</h2>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {property.description}
            </p>
          </section>

          {property.amenities.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-semibold">Amenities</h2>
              <ul className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                {property.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Separator />

          <section className="space-y-3">
            <h2 className="font-semibold">
              Reviews{" "}
              {avgRating !== null && (
                <span className="text-sm font-normal text-muted-foreground">
                  · {avgRating.toFixed(1)} ({reviews.length})
                </span>
              )}
            </h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {r.tenant?.name ?? "Tenant"}
                      </span>
                      <span className="text-sm text-amber-500">
                        {"★".repeat(r.rating)}
                        <span className="text-muted-foreground">
                          {"★".repeat(5 - r.rating)}
                        </span>
                      </span>
                    </div>
                    {r.comment && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {r.comment}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Sticky sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(property.price)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / month
                  </span>
                </p>
              </div>

              <RequestToRent property={property} />

              {property.landlord && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {initials(property.landlord.name)}
                    </span>
                    <div className="text-sm">
                      <p className="font-medium">{property.landlord.name}</p>
                      <p className="text-muted-foreground">
                        Host since {formatDate(property.landlord.createdAt)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
