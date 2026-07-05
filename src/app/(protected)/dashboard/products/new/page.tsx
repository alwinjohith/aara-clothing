import { getCategoryTree } from "@/features/categories/categories-service";
import { ProductForm } from "@/features/products/product-form";

export default async function NewProductPage() {
  const categories = await getCategoryTree();

  return (
    <div className="p-6">
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
