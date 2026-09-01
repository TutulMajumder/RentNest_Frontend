import type { Metadata } from "next";
import Link from "next/link";
import { Ban } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Ban className="size-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Payment cancelled</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        You cancelled the checkout. Your rental request is still approved — you
        can pay any time from your dashboard.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/dashboard/tenant/requests">Back to my requests</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/properties">Keep browsing</Link>
        </Button>
      </div>
    </main>
  );
}
