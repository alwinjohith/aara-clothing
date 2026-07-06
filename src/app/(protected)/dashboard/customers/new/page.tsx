import { CustomerForm } from "@/features/customers/customer-form";

export default function NewCustomerPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          New Customer
        </h1>
        <p className="text-muted-foreground">Add a new customer to the database</p>
      </div>
      <CustomerForm mode="create" />
    </div>
  );
}
