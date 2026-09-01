"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DASHBOARD_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

export function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = DASHBOARD_NAV[role];

  return (
    <aside className="hidden w-52 shrink-0 md:block">
      <nav className="sticky top-24 flex flex-col gap-1">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== DASHBOARD_NAV[role][0].href &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
