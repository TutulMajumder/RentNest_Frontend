"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { House, KeyRound, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { PUBLIC_NAV, ROLE_DASHBOARD, ROLE_LABEL } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";
import type { NavbarProps } from "@/lib/types";
import { logout } from "@/service/logout";
import { ThemeToggle } from "./theme-toggle";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="RentNest home">
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <House className="size-5" strokeWidth={2.2} />
        <KeyRound
          className="absolute -right-1 -bottom-1 size-3.5 rounded-full bg-background p-0.5 text-primary"
          strokeWidth={2.5}
        />
      </span>
      <span className="text-lg font-bold tracking-tight">RentNest</span>
    </Link>
  );
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = user.success ? user.data : null;
  const dashboardHref = current ? ROLE_DASHBOARD[current.role] : "/login";

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    router.replace("/login");
    router.refresh();
  };

  const links = [
    ...PUBLIC_NAV,
    ...(current ? [{ label: "Dashboard", href: dashboardHref }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Brand />
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {current ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 pr-2 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials(current.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">
                  {current.name}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span>{current.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {current.email}
                    </span>
                    <Badge variant="secondary" className="mt-1 w-fit">
                      {ROLE_LABEL[current.role]}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardHref}>
                    <LayoutDashboard data-icon="inline-start" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User data-icon="inline-start" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut data-icon="inline-start" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Button variant="ghost" asChild>
                <Link href="/register">Register</Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Brand />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4">
                {links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                {!current && (
                  <div className="mt-4 flex flex-col gap-2">
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="outline" asChild onClick={() => setOpen(false)}>
                      <Link href="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
