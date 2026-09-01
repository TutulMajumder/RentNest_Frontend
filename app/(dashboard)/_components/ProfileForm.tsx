"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared/field";
import { profileSchema, type ProfileValues } from "@/lib/validations/auth";
import type { CurrentUser } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";
import { updateProfileAction } from "../_actions/profileActions";

export function ProfileForm({ user }: { user: CurrentUser }) {
  const [state, formAction, actionPending] = useActionState(
    updateProfileAction,
    null,
  );
  const [isPending, startTransition] = useTransition();
  const pending = actionPending || isPending;
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      oldPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      reset((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
    } else {
      state.errorDetails?.forEach((e) =>
        setError(e.field as keyof ProfileValues, { message: e.message }),
      );
      toast.error(state.message);
    }
  }, [state, reset, setError]);

  const onSubmit = handleSubmit((values) => {
    const fd = new FormData();
    fd.set("name", values.name);
    fd.set("phone", values.phone ?? "");
    if (values.newPassword) {
      fd.set("oldPassword", values.oldPassword ?? "");
      fd.set("newPassword", values.newPassword);
    }
    setUser({ ...user, name: values.name, phone: values.phone || null });
    startTransition(() => formAction(fd));
  });

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-5" noValidate>
      <Field htmlFor="name" label="Full name" required error={errors.name?.message}>
        <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
      </Field>

      <Field htmlFor="email" label="Email">
        <Input id="email" value={user.email} disabled readOnly />
      </Field>

      <Field htmlFor="phone" label="Phone" error={errors.phone?.message}>
        <Input
          id="phone"
          type="tel"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
      </Field>

      <div className="rounded-lg border p-4">
        <p className="mb-3 text-sm font-medium">Change password</p>
        <div className="space-y-4">
          <Field
            htmlFor="oldPassword"
            label="Current password"
            error={errors.oldPassword?.message}
          >
            <Input
              id="oldPassword"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.oldPassword}
              {...register("oldPassword")}
            />
          </Field>
          <Field
            htmlFor="newPassword"
            label="New password"
            error={errors.newPassword?.message}
          >
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.newPassword}
              {...register("newPassword")}
            />
          </Field>
        </div>
      </div>

      <Button type="submit" disabled={pending || !isDirty}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
