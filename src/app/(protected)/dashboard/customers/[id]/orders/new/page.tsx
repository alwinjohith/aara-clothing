import { OrderForm } from "@/features/orders/order-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewOrderPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">New Order</h2>
        <p className="text-xs text-muted-foreground sm:text-sm">Create a new order for this customer</p>
      </div>
      <OrderForm customerId={id} mode="create" />
    </div>
  );
}
