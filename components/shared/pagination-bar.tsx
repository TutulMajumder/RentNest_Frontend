"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationBar({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  if (totalPages <= 1) return null;

  const go = (next: number) => {
    const sp = new URLSearchParams(params);
    sp.set("page", String(next));
    router.push(`${pathname}?${sp.toString()}`);
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft data-icon="inline-start" />
        Prev
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
      >
        Next
        <ChevronRight data-icon="inline-end" />
      </Button>
    </div>
  );
}
