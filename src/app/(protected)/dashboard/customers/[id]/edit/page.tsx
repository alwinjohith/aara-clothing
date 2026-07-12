import { notFound } from "next/navigation";
import { getCustomerById } from "@/features/customers/customers-service";
import { CustomerForm } from "@/features/customers/customer-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCustomerPage({ params }: Props) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">Edit Customer</h2>
        <p className="text-xs text-muted-foreground sm:text-sm">Update customer information</p>
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
