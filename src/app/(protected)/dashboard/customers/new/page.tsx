import { CustomerForm } from "@/features/customers/customer-form";

export default function NewCustomerPage() {
  return (
<<<<<<< HEAD
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">New Customer</h2>
        <p className="text-sm text-muted-foreground">Add a new customer to the database</p>
=======
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          New Customer
        </h1>
        <p className="mt-1 text-muted-foreground">Add a new customer to the database</p>
>>>>>>> f2172a4 (added settings)
      </div>
      <CustomerForm mode="create" />
    </div>
  );
}
