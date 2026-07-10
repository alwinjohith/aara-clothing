import { OrderForm } from "@/features/orders/order-form";

export default function CreateOrderPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Create Order</h1>
        <p className="text-muted-foreground">
          Create a new customer order
        </p>
      </div>
      <OrderForm mode="create" />
    </div>
  );
}
