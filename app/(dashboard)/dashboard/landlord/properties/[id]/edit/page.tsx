import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { ApiError } from "@/service/api-client";
import { getCategories } from "@/service/categories";
import { getProperty } from "@/service/properties";
import { PropertyForm } from "../../../../../_components/property-form";

export const metadata: Metadata = { title: "Edit property" };

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let property;
  try {
    property = await getProperty(id);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
      notFound();
    }
    throw err;
  }

  const categories = await getCategories();

  return (
    <>
      <PageHeader title="Edit property" description={property.title} />
      <PropertyForm categories={categories} property={property} />
    </>
  );
}
