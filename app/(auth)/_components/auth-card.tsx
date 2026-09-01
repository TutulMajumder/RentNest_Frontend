import Link from "next/link";
import { House, KeyRound } from "lucide-react";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 rounded-xl border bg-card p-8 shadow-sm ring-1 ring-foreground/5">
      <div className="space-y-3 text-center">
        <Link
          href="/"
          aria-label="RentNest home"
          className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"
        >
          <span className="relative flex items-center justify-center">
            <House className="size-5" strokeWidth={2.2} />
            <KeyRound
              className="absolute -right-2 -bottom-2 size-3.5 rounded-full bg-primary text-primary-foreground"
              strokeWidth={2.5}
            />
          </span>
        </Link>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
