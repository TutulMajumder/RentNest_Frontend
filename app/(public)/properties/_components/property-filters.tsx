"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AMENITIES, DIVISIONS } from "@/lib/constants";
import { useDebounce } from "@/hooks/use-debounce";
import type { Category } from "@/lib/types";

const SORTS = [
  { value: "createdAt.desc", label: "Newest" },
  { value: "price.asc", label: "Price: low to high" },
  { value: "price.desc", label: "Price: high to low" },
  { value: "bedrooms.desc", label: "Most bedrooms" },
];

export function PropertyFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("searchTerm") ?? "");
  const debouncedSearch = useDebounce(search, 400);

  const setParam = useCallback(
    (patch: Record<string, string | null>) => {
      const sp = new URLSearchParams(params);
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") sp.delete(key);
        else sp.set(key, value);
      }
      sp.delete("page");
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  useEffect(() => {
    if (debouncedSearch !== (params.get("searchTerm") ?? "")) {
      setParam({ searchTerm: debouncedSearch || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const selectedAmenities: string[] = (() => {
    try {
      return JSON.parse(params.get("amenities") ?? "[]");
    } catch {
      return [];
    }
  })();

  const toggleAmenity = (amenity: string, checked: boolean) => {
    const next = checked
      ? [...selectedAmenities, amenity]
      : selectedAmenities.filter((a) => a !== amenity);
    setParam({ amenities: next.length ? JSON.stringify(next) : null });
  };

  const sortValue =
    params.get("sortBy") && params.get("sortOrder")
      ? `${params.get("sortBy")}.${params.get("sortOrder")}`
      : "createdAt.desc";

  const hasFilters = [...params.keys()].some((k) => k !== "page");

  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              setSearch("");
              router.replace(pathname, { scroll: false });
            }}
          >
            <X data-icon="inline-start" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Title, address, city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Division</Label>
        <Select
          value={params.get("division") ?? "all"}
          onValueChange={(v) => setParam({ division: v === "all" ? null : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any division" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any division</SelectItem>
            {DIVISIONS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Category</Label>
        <Select
          value={params.get("categoryId") ?? "all"}
          onValueChange={(v) => setParam({ categoryId: v === "all" ? null : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any type</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Price range (৳ / month)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            defaultValue={params.get("minPrice") ?? ""}
            onBlur={(e) => setParam({ minPrice: e.target.value || null })}
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            defaultValue={params.get("maxPrice") ?? ""}
            onBlur={(e) => setParam({ maxPrice: e.target.value || null })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Bedrooms</Label>
        <Select
          value={params.get("bedrooms") ?? "any"}
          onValueChange={(v) => setParam({ bedrooms: v === "any" ? null : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {[1, 2, 3, 4, 5].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Sort by</Label>
        <Select
          value={sortValue}
          onValueChange={(v) => {
            const [sortBy, sortOrder] = v.split(".");
            setParam({ sortBy, sortOrder });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="grid grid-cols-1 gap-2">
          {AMENITIES.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Checkbox
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={(c) => toggleAmenity(amenity, c === true)}
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
