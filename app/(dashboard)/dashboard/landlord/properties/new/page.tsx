import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { getCategories } from "@/service/categories";
import { PropertyForm } from "../../../../_components/property-form";

export const metadata: Metadata = { title: "New property" };

export default async function NewPropertyPage() {
  const categories = await getCategories();
  return (
    <>
      <PageHeader
        title="Add a property"
        description="List a new rental. You can edit or unpublish it any time."
      />
      <PropertyForm categories={categories} />
    </>
  );
}
