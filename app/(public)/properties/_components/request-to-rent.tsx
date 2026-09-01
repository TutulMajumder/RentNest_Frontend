"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/shared/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  rentalRequestSchema,
  type RentalRequestValues,
} from "@/lib/validations/rental";
import { useAuthStore } from "@/stores/auth-store";
import type { Property } from "@/lib/types";
import { createRentalRequestAction } from "../_actions/rentalActions";

export function RequestToRent({ property }: { property: Property }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  const [state, formAction, actionPending] = useActionState(
    createRentalRequestAction,
    null,
  );
  const [isPending, startTransition] = useTransition();
  const pending = actionPending || isPending;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RentalRequestValues>({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: { moveInDate: "", moveOutDate: "", message: "" },
  });

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
      router.push("/dashboard/tenant/requests");
    } else {
      state.errorDetails?.forEach((e) =>
        setError(e.field as keyof RentalRequestValues, { message: e.message }),
      );
      toast.error(state.message);
    }
  }, [state, router, setError]);

  const unavailable = property.availabilityStatus !== "AVAILABLE";

  if (!user) {
    return (
      <Button asChild className="w-full">
        <Link href={`/login?next=/properties/${property.id}`}>
          Sign in to request
        </Link>
      </Button>
    );
  }

  if (user.role !== "TENANT") {
    return (
      <p className="text-sm text-muted-foreground">
        Only tenants can submit rental requests.
      </p>
    );
  }

  const onSubmit = handleSubmit((values) => {
    const fd = new FormData();
    fd.set("propertyId", property.id);
    fd.set("moveInDate", values.moveInDate);
    if (values.moveOutDate) fd.set("moveOutDate", values.moveOutDate);
    if (values.message) fd.set("message", values.message);
    startTransition(() => formAction(fd));
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={unavailable}>
          {unavailable ? "Not available" : "Request to rent"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request to rent</DialogTitle>
          <DialogDescription>{property.title}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field
            htmlFor="moveInDate"
            label="Move-in date"
            required
            error={errors.moveInDate?.message}
          >
            <Input
              id="moveInDate"
              type="date"
              aria-invalid={!!errors.moveInDate}
              {...register("moveInDate")}
            />
          </Field>

          <Field
            htmlFor="moveOutDate"
            label="Move-out date"
            hint="Optional"
            error={errors.moveOutDate?.message}
          >
            <Input
              id="moveOutDate"
              type="date"
              aria-invalid={!!errors.moveOutDate}
              {...register("moveOutDate")}
            />
          </Field>

          <Field
            htmlFor="message"
            label="Message to landlord"
            hint="Optional"
            error={errors.message?.message}
          >
            <Textarea
              id="message"
              rows={3}
              placeholder="Tell the landlord about yourself…"
              {...register("message")}
            />
          </Field>

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Submitting…" : "Submit request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
