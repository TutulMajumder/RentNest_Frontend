"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/shared/field";
import { AMENITIES, DIVISIONS } from "@/lib/constants";
import { propertySchema, type PropertyValues } from "@/lib/validations/property";
import type { Category, Property } from "@/lib/types";
import {
  createPropertyAction,
  updatePropertyAction,
} from "../_actions/propertyActions";

type Props = {
  categories: Category[];
  property?: Property;
};

export function PropertyForm({ categories, property }: Props) {
  const router = useRouter();
  const isEdit = !!property;

  const [state, formAction, actionPending] = useActionState(
    isEdit ? updatePropertyAction : createPropertyAction,
    null,
  );
  const [isPending, startTransition] = useTransition();
  const pending = actionPending || isPending;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<PropertyValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title ?? "",
      description: property?.description ?? "",
      price: property ? String(property.price) : "",
      bedrooms: property ? String(property.bedrooms) : "",
      bathrooms: property ? String(property.bathrooms) : "",
      sizeSqft: property?.sizeSqft ? String(property.sizeSqft) : "",
      address: property?.address ?? "",
      city: property?.city ?? "",
      division: property?.division ?? "",
      categoryId: property?.categoryId ?? "",
      availabilityStatus:
        property?.availabilityStatus === "UNAVAILABLE"
          ? "UNAVAILABLE"
          : "AVAILABLE",
      amenities: property?.amenities ?? [],
      images: property?.images?.length ? property.images : [""],
    },
  });

  const amenities = watch("amenities") ?? [];
  const images = watch("images") ?? [];

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      router.push("/dashboard/landlord/properties");
    } else {
      state.errorDetails?.forEach((e) =>
        setError(e.field as keyof PropertyValues, { message: e.message }),
      );
      toast.error(state.message);
    }
  }, [state, router, setError]);

  const onSubmit = handleSubmit((values) => {
    const fd = new FormData();
    if (property) fd.set("id", property.id);
    fd.set("title", values.title);
    fd.set("description", values.description);
    fd.set("price", values.price);
    fd.set("bedrooms", values.bedrooms);
    fd.set("bathrooms", values.bathrooms);
    if (values.sizeSqft) fd.set("sizeSqft", values.sizeSqft);
    fd.set("address", values.address);
    fd.set("city", values.city);
    fd.set("division", values.division);
    fd.set("categoryId", values.categoryId);
    fd.set("availabilityStatus", values.availabilityStatus);
    fd.set("amenities", JSON.stringify(values.amenities));
    fd.set(
      "images",
      JSON.stringify(values.images.map((i) => i.trim()).filter(Boolean)),
    );
    startTransition(() => formAction(fd));
  });

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6" noValidate>
      <Field htmlFor="title" label="Title" required error={errors.title?.message}>
        <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
      </Field>

      <Field
        htmlFor="description"
        label="Description"
        required
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          rows={4}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          htmlFor="price"
          label="Monthly rent (৳)"
          required
          error={errors.price?.message}
        >
          <Input
            id="price"
            type="number"
            aria-invalid={!!errors.price}
            {...register("price")}
          />
        </Field>
        <Field
          htmlFor="bedrooms"
          label="Bedrooms"
          required
          error={errors.bedrooms?.message}
        >
          <Input
            id="bedrooms"
            type="number"
            aria-invalid={!!errors.bedrooms}
            {...register("bedrooms")}
          />
        </Field>
        <Field
          htmlFor="bathrooms"
          label="Bathrooms"
          required
          error={errors.bathrooms?.message}
        >
          <Input
            id="bathrooms"
            type="number"
            aria-invalid={!!errors.bathrooms}
            {...register("bathrooms")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          htmlFor="sizeSqft"
          label="Size (sqft)"
          hint="Optional"
          error={errors.sizeSqft?.message as string | undefined}
        >
          <Input id="sizeSqft" type="number" {...register("sizeSqft")} />
        </Field>
        <Field
          htmlFor="address"
          label="Street address"
          required
          error={errors.address?.message}
        >
          <Input
            id="address"
            aria-invalid={!!errors.address}
            {...register("address")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field htmlFor="city" label="City" required error={errors.city?.message}>
          <Input id="city" aria-invalid={!!errors.city} {...register("city")} />
        </Field>

        <Field
          label="Division"
          htmlFor="division"
          required
          error={errors.division?.message}
        >
          <Select
            value={watch("division")}
            onValueChange={(v) =>
              setValue("division", v, { shouldValidate: true })
            }
          >
            <SelectTrigger id="division">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {DIVISIONS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Category"
          htmlFor="categoryId"
          required
          error={errors.categoryId?.message}
        >
          <Select
            value={watch("categoryId")}
            onValueChange={(v) =>
              setValue("categoryId", v, { shouldValidate: true })
            }
          >
            <SelectTrigger id="categoryId">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Availability" htmlFor="availabilityStatus">
        <Select
          value={watch("availabilityStatus")}
          onValueChange={(v) =>
            setValue("availabilityStatus", v as "AVAILABLE" | "UNAVAILABLE")
          }
        >
          <SelectTrigger id="availabilityStatus" className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <div className="space-y-2">
        <p className="text-sm font-medium">Amenities</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AMENITIES.map((a) => (
            <label key={a} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={amenities.includes(a)}
                onCheckedChange={(c) =>
                  setValue(
                    "amenities",
                    c === true
                      ? [...amenities, a]
                      : amenities.filter((x) => x !== a),
                  )
                }
              />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Image URLs <span className="text-destructive">*</span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setValue("images", [...images, ""])}
          >
            <Plus data-icon="inline-start" />
            Add
          </Button>
        </div>
        {images.map((_: string, i: number) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="https://…"
              aria-invalid={!!errors.images}
              {...register(`images.${i}` as const)}
            />
            {images.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove image"
                onClick={() =>
                  setValue(
                    "images",
                    images.filter((_v: string, idx: number) => idx !== i),
                  )
                }
              >
                <Trash2 />
              </Button>
            )}
          </div>
        ))}
        {errors.images && (
          <p className="text-xs text-destructive">
            {errors.images.message ?? "Check your image URLs"}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create property"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
