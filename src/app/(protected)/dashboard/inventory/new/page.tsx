import { ProductForm } from "@/features/inventory/product-form";

export default async function NewProductPage() {
  return (
    <div>
      <ProductForm mode="create" />
    </div>
  );
}
