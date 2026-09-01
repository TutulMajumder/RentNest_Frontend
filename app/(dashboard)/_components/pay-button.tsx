"use client";

import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createPaymentSessionAction } from "../_actions/paymentActions";

export function PayButton({
  rentalRequestId,
  size = "default",
  label = "Pay now",
}: {
  rentalRequestId: string;
  size?: "sm" | "default";
  label?: string;
}) {
  const [state, formAction, actionPending] = useActionState(
    createPaymentSessionAction,
    null,
  );
  const [isPending, startTransition] = useTransition();
  const pending = actionPending || isPending;

  useEffect(() => {
    if (state && !state.success) toast.error(state.message);
  }, [state]);

  return (
    <Button
      size={size}
      disabled={pending}
      onClick={() => {
        const fd = new FormData();
        fd.set("rentalRequestId", rentalRequestId);
        startTransition(() => formAction(fd));
      }}
    >
      {pending ? "Redirecting…" : label}
    </Button>
  );
}
