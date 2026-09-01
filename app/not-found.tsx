import Link from "next/link";
import { House, MapPinX, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MapPinX className="size-8" strokeWidth={1.75} />
        </div>

        <p className="text-sm font-semibold tracking-widest text-primary uppercase">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          This listing doesn&apos;t exist
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you&apos;re looking for may have been removed, renamed, or
          never existed. Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <House data-icon="inline-start" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/properties">
              <Search data-icon="inline-start" />
              Browse properties
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
