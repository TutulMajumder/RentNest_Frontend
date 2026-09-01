import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { getCategories } from "@/service/categories";
import { CategoryManager } from "../../../_components/category-manager";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHeader
        title="Categories"
        description="Property types landlords can choose from."
      />
      <CategoryManager categories={categories} />
    </>
  );
}
