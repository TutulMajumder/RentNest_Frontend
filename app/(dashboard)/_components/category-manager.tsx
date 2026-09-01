"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/shared/field";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categorySchema, type CategoryValues } from "@/lib/validations/category";
import { formatDate } from "@/lib/utils";
import type { Category } from "@/lib/types";
import {
  deleteCategoryAction,
  upsertCategoryAction,
} from "../_actions/categoryActions";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();

  const [state, formAction, actionPending] = useActionState(
    upsertCategoryAction,
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
      router.refresh();
    } else {
      state.errorDetails?.forEach((e) =>
        setError(e.field as keyof CategoryValues, { message: e.message }),
      );
      toast.error(state.message);
    }
  }, [state, router, setError]);

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", description: "" });
    setOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    reset({ name: c.name, description: c.description ?? "" });
    setOpen(true);
  };

  const onSubmit = handleSubmit((values) => {
    const fd = new FormData();
    if (editing) fd.set("id", editing.id);
    fd.set("name", values.name);
    if (values.description) fd.set("description", values.description);
    startTransition(() => formAction(fd));
  });

  const confirmDelete = () => {
    if (!deleting) return;
    const id = deleting.id;
    setDeleting(null);
    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
      router.refresh();
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus data-icon="inline-start" />
          New category
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create categories so landlords can classify their listings."
        />
      ) : (
        <div className="divide-y rounded-lg border">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <p className="font-medium">{c.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {c.description || "No description"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Added {formatDate(c.createdAt)}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => openEdit(c)}
                  aria-label="Edit"
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleting(c)}
                  aria-label="Delete"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit category" : "New category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Field
              htmlFor="name"
              label="Name"
              required
              error={errors.name?.message}
            >
              <Input
                id="name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
            </Field>
            <Field
              htmlFor="description"
              label="Description"
              hint="Optional"
              error={errors.description?.message}
            >
              <Textarea id="description" rows={3} {...register("description")} />
            </Field>
            <DialogFooter>
              <Button type="submit" disabled={actionPending || isPending}>
                {actionPending || isPending
                  ? "Saving…"
                  : editing
                    ? "Save"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove “{deleting?.name}”?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Existing properties keep their category, but landlords won&apos;t be
            able to pick it for new listings.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={confirmDelete}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
