import { notFound } from "next/navigation";
import { getProductById } from "@/features/products/products-service";
import { getCategoryTree } from "@/features/categories/categories-service";
import { ProductForm } from "@/features/products/product-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const categories = await getCategoryTree();

  return (
    <div className="p-6">
      <ProductForm mode="edit" categories={categories} initialData={product} />
    </div>
  );
}
