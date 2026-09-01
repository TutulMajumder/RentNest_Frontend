"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DASHBOARD_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

export function DashboardMobileNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = DASHBOARD_NAV[role];

  return (
    <nav className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 md:hidden">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== items[0].href && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
