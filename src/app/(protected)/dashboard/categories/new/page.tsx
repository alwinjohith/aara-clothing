import { getCategoryTree } from "@/features/categories/categories-service";
import { CategoryForm } from "@/features/categories/category-form";

export default async function NewCategoryPage() {
  const categories = await getCategoryTree();

  return (
    <div className="p-6">
      <CategoryForm mode="create" categories={categories} />
    </div>
  );
}
