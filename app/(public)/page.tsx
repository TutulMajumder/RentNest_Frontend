import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PropertyGrid,
  PropertyGridSkeleton,
} from "@/components/shared/property-grid";
import type { Property } from "@/lib/types";
import { getProperties } from "@/service/properties";

export const metadata: Metadata = {
  title: "RentNest — Find & list rental properties with ease",
};

async function loadFeatured(): Promise<Property[] | null> {
  try {
    const { data } = await getProperties({
      limit: 6,
      sortBy: "createdAt",
      sortOrder: "desc",
      availabilityStatus: "AVAILABLE",
    });
    return data;
  } catch {
    return null;
  }
}

async function FeaturedProperties() {
  const data = await loadFeatured();

  if (!data) {
    return (
      <p className="text-sm text-muted-foreground">
        Listings are temporarily unavailable.{" "}
        <Link href="/properties" className="text-primary hover:underline">
          Try again
        </Link>
      </p>
    );
  }

  return <PropertyGrid properties={data} />;
}

export default function HomePage() {
  return (
    <>
      <section className="border-b bg-muted/30">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find &amp; list rental properties with ease
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Browse verified listings, submit rental requests, and pay securely —
            all in one place.
          </p>
          <div className="flex gap-3">
            <Button asChild size="lg">
              <Link href="/properties">Browse properties</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Latest listings</h2>
          <Link
            href="/properties"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <Suspense fallback={<PropertyGridSkeleton count={6} />}>
          <FeaturedProperties />
        </Suspense>
      </section>
    </>
  );
}
