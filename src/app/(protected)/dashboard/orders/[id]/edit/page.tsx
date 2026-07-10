import { notFound, redirect } from "next/navigation";
import { getOrderById } from "@/features/orders/orders-service";
import { OrderForm } from "@/features/orders/order-form";
import { ORDER_STATUSES } from "@/lib/constants";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  if (
    order.status !== ORDER_STATUSES.PENDING &&
    order.status !== ORDER_STATUSES.PROCESSING
  ) {
    redirect(`/dashboard/orders/${id}`);
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit Order {order.orderNumber}
        </h1>
        <p className="text-muted-foreground">
          Update order items or customer information
        </p>
      </div>
      <OrderForm
        mode="edit"
        initialData={{
          id: order.id,
          customerId: order.customerId,
          customer: order.customer as { id: string; name: string; phone: string },
          notes: order.notes,
          items: (order.items as Array<{
            id: string;
            variantId: string;
            quantity: number;
            price: number;
            variant: {
              id: string;
              color: string;
              size: string;
              sku: string;
              stock: number;
              product: { id: string; name: string; price: number };
            };
          }>).map((i) => ({
            id: i.id,
            variantId: i.variantId,
            quantity: i.quantity,
            price: Number(i.price),
            variant: {
              id: i.variant.id,
              color: i.variant.color,
              size: i.variant.size,
              sku: i.variant.sku,
              stock: i.variant.stock,
              product: {
                id: i.variant.product.id,
                name: i.variant.product.name,
                price: Number(i.variant.product.price),
              },
            },
          })),
        }}
      />
    </div>
  );
}
