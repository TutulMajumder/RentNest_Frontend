"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PropertiesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-xl font-bold tracking-tight">
        Couldn&apos;t load properties
      </h1>
      <p className="text-sm text-muted-foreground">
        {error.message || "The listings service is temporarily unavailable."}
      </p>
      <Button onClick={reset}>
        <RotateCcw data-icon="inline-start" />
        Retry
      </Button>
    </div>
  );
}
