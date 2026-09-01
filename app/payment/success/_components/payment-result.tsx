"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { verifyPaymentAction, type VerifyResult } from "../_actions/verifyPayment";

const MAX_TRIES = 5;

export function PaymentResult({ sessionId }: { sessionId: string | null }) {
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [checking, setChecking] = useState(true);
  const tries = useRef(0);

  useEffect(() => {
    if (!sessionId) {
      setResult({ ok: false, message: "Missing checkout session." });
      setChecking(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      const res = await verifyPaymentAction(sessionId);
      if (cancelled) return;
      setResult(res);
      tries.current += 1;

      const stillPending = res.ok && res.status === "PENDING";
      if (stillPending && tries.current < MAX_TRIES) {
        setTimeout(run, 2500);
      } else {
        setChecking(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const status = result?.ok ? result.status : null;
  const completed = status === "COMPLETED";
  const failed = result?.ok === false || status === "FAILED";
  const pending = status === "PENDING";

  const icon = completed ? (
    <CheckCircle2 className="size-8" />
  ) : failed ? (
    <XCircle className="size-8" />
  ) : (
    <Clock className="size-8" />
  );

  const tone = completed
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15"
    : failed
      ? "bg-destructive/10 text-destructive"
      : "bg-amber-100 text-amber-700 dark:bg-amber-500/15";

  const title = completed
    ? "Payment successful"
    : failed
      ? "Payment could not be confirmed"
      : "Confirming your payment…";

  const message = completed
    ? "Your rental is now active. A receipt is in your dashboard."
    : failed
      ? (result?.ok === false && result.message) ||
        "Your payment wasn't completed. You can retry from your requests."
      : checking
        ? "Checking with the payment provider. This page updates automatically."
        : "Still processing. Refresh in a moment or check your requests.";

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className={`mb-6 flex size-16 items-center justify-center rounded-2xl ${tone}`}>
        {icon}
      </div>

      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>

      {result?.ok && (
        <Card className="mt-6 w-full">
          <CardContent className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{result.propertyTitle}</span>
            <span className="font-semibold">{formatCurrency(result.amount)}</span>
          </CardContent>
        </Card>
      )}

      {pending && checking && (
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Verifying…
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/dashboard/tenant/requests">Go to my requests</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/properties">Keep browsing</Link>
        </Button>
      </div>
    </main>
  );
}
