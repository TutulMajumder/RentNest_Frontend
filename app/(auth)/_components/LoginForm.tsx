"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared/field";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { loginAction } from "../_actions/authActions";

export default function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const registered = params.get("registered");

  const [state, formAction, actionPending] = useActionState(loginAction, null);
  const [isPending, startTransition] = useTransition();
  const pending = actionPending || isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (registered) toast.success("Account created. Please sign in.");
  }, [registered]);

  useEffect(() => {
    if (state && !state.success) toast.error(state.message);
  }, [state]);

  const onSubmit = handleSubmit((values) => {
    const fd = new FormData();
    fd.set("email", values.email);
    fd.set("password", values.password);
    fd.set("next", next);
    startTransition(() => formAction(fd));
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field htmlFor="email" label="Email" required error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
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
          placeholder="Enter your password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
      </Field>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Login"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
