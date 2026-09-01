"use client";

import Link from "next/link";
import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { registerAction } from "../_actions/registerAction";

const ROLES = [
  { value: "TENANT", label: "Tenant", hint: "Find & rent a place" },
  { value: "LANDLORD", label: "Landlord", hint: "List & manage rentals" },
] as const;

export default function RegisterForm() {
  const [state, formAction, actionPending] = useActionState(registerAction, null);
  const [isPending, startTransition] = useTransition();
  const pending = actionPending || isPending;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "TENANT",
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Surface server-side validation errors on the right fields.
  useEffect(() => {
    if (state && !state.success) {
      state.errorDetails?.forEach((e) =>
        setError(e.field as keyof RegisterValues, { message: e.message }),
      );
      toast.error(state.message);
    }
  }, [state, setError]);

  const onSubmit = handleSubmit((values) => {
    const fd = new FormData();
    fd.set("role", values.role);
    fd.set("name", values.name);
    fd.set("email", values.email);
    fd.set("password", values.password);
    fd.set("confirmPassword", values.confirmPassword);
    if (values.phone) fd.set("phone", values.phone);
    startTransition(() => formAction(fd));
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">I want to…</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {ROLES.map((role) => (
            <label
              key={role.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 border border-input p-3 transition-colors hover:bg-muted",
                "has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:ring-1 has-[:checked]:ring-primary",
              )}
            >
              <input
                type="radio"
                value={role.value}
                className="mt-0.5 size-4 shrink-0 accent-primary"
                {...register("role")}
              />
              <span>
                <span className="block text-sm font-medium">{role.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {role.hint}
                </span>
              </span>
            </label>
          ))}
        </div>
        {errors.role && (
          <p className="text-xs text-destructive">{errors.role.message}</p>
        )}
      </fieldset>

      <Field
        htmlFor="name"
        label="Full name"
        required
        error={errors.name?.message}
      >
        <Input
          id="name"
          placeholder="Jane Doe"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <Field htmlFor="email" label="Email" required error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>

      <Field
        htmlFor="phone"
        label="Phone"
        hint="Optional"
        error={errors.phone?.message}
      >
        <Input
          id="phone"
          type="tel"
          placeholder="01XXXXXXXXX"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
      </Field>

      <Field
        htmlFor="password"
        label="Password"
        required
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          placeholder="At least 8 characters"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
      </Field>

      <Field
        htmlFor="confirmPassword"
        label="Confirm password"
        required
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </Field>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
