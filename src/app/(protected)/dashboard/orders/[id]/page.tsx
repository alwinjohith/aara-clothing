import { notFound } from "next/navigation";
import { getOrderById } from "@/features/orders/orders-service";
import { OrderDetail } from "@/features/orders/order-detail";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="p-6">
      <OrderDetail order={order as never} />
    </div>
  );
}
