import { ProductForm } from "@/features/inventory/product-form";

export default async function NewProductPage() {
  return (
    <div className="p-6">
      <ProductForm mode="create" />
    </div>
  );
}
