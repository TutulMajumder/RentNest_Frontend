import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, MapPin } from "lucide-react";

import { AvailabilityBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  const cover = property.images?.[0];

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        <div className="absolute top-3 left-3">
          <AvailabilityBadge status={property.availabilityStatus} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold">{property.title}</h3>
          {property.category && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {property.category.name}
            </span>
          )}
        </div>

        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="line-clamp-1">
            {property.city}, {property.division}
          </span>
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="font-bold text-primary">
            {formatCurrency(property.price)}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / mo
            </span>
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BedDouble className="size-3.5" />
              {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="size-3.5" />
              {property.bathrooms}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
