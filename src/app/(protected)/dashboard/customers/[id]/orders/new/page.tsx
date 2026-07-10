import { OrderForm } from "@/features/orders/order-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewOrderPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="p-6">
      <OrderForm customerId={id} mode="create" />
    </div>
  );
}
