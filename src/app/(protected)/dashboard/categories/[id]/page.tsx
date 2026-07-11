import { notFound } from "next/navigation";
import { getCategoryById, getCategoryTree } from "@/features/categories/categories-service";
import { CategoryForm } from "@/features/categories/category-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  const categories = await getCategoryTree();

  const disabledIds = await getDescendantIds(id);

  return (
    <div className="p-8">
      <CategoryForm
        mode="edit"
        categories={categories}
        initialData={category}
        disabledCategoryIds={disabledIds}
      />
    </div>
  );
}

async function getDescendantIds(id: string): Promise<string[]> {
  const all = await getCategoryTree();
  const ids: string[] = [id];

  function collect(parentId: string) {
    for (const cat of all) {
      if (cat.parentId === parentId) {
        ids.push(cat.id);
        collect(cat.id);
      }
    }
  }

  collect(id);
  return ids;
}
