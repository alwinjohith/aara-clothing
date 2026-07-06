import { notFound } from "next/navigation";
import { getCustomerById } from "@/features/customers/customers-service";
import { CustomerForm } from "@/features/customers/customer-form";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit Customer
        </h1>
        <p className="text-muted-foreground">Update customer information</p>
      </div>
      <CustomerForm
        mode="edit"
        initialData={{
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        }}
      />
    </div>
  );
}
