import Link from "next/link";
import { Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PropertyNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Property not found</h1>
      <p className="text-sm text-muted-foreground">
        This listing may have been removed or is no longer available.
      </p>
      <Button asChild>
        <Link href="/properties">
          <Home data-icon="inline-start" />
          Browse properties
        </Link>
      </Button>
    </div>
  );
}
