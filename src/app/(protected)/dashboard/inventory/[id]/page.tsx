import { notFound } from "next/navigation";
import { getProductById } from "@/features/inventory/inventory-service";
import { ProductForm } from "@/features/inventory/product-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
}
