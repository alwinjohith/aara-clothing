"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import { ORDER_STATUSES, getValidOrderStatusTransitions } from "@/lib/constants";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/format";
import { Pencil, XCircle, Printer } from "lucide-react";

interface OrderDetailData {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    name: string;
    phone: string;
    address: string | null;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    subtotal: number;
    variant: {
      id: string;
      color: string;
      size: string;
      sku: string;
      product: { id: string; name: string; price: number };
      images: Array<{ url: string }>;
    };
  }>;
  user: { id: string; username: string };
}

interface OrderDetailProps {
  order: OrderDetailData;
}

export function OrderDetail({ order }: OrderDetailProps) {
  const router = useRouter();
  const canEdit =
    order.status === ORDER_STATUSES.PENDING ||
    order.status === ORDER_STATUSES.PROCESSING;
  const allowedTransitions = getValidOrderStatusTransitions(
    order.status as keyof typeof ORDER_STATUSES
  );

  async function handleStatusChange(newStatus: string) {
    try {
      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      toast.success("Order status updated");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    await handleStatusChange(ORDER_STATUSES.CANCELLED);
  }

  const statusTimeline: Array<{ status: string; label: string; date: Date }> = [
    { status: ORDER_STATUSES.PENDING, label: "Pending", date: order.createdAt },
  ];

  if (
    order.status === ORDER_STATUSES.PROCESSING ||
    order.status === ORDER_STATUSES.COMPLETED
  ) {
    statusTimeline.push({ status: ORDER_STATUSES.PROCESSING, label: "Processing", date: order.updatedAt });
  }

  if (order.status === ORDER_STATUSES.COMPLETED) {
    statusTimeline.push({ status: ORDER_STATUSES.COMPLETED, label: "Completed", date: order.updatedAt });
  }

  if (order.status === ORDER_STATUSES.CANCELLED) {
    statusTimeline.push({ status: ORDER_STATUSES.CANCELLED, label: "Cancelled", date: order.updatedAt });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order {order.orderNumber}
          </h1>
          <p className="text-muted-foreground">
            Created {formatDateTime(order.createdAt)} by {order.user.username}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer className="size-4 mr-1" />
            Print Invoice
          </Button>
          {canEdit && (
            <Link href={`/dashboard/orders/${order.id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="size-4 mr-1" />
                Edit
              </Button>
            </Link>
          )}
          {(order.status === ORDER_STATUSES.PENDING ||
            order.status === ORDER_STATUSES.PROCESSING) && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancel}
            >
              <XCircle className="size-4 mr-1" />
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusBadge
              status={order.status as keyof typeof ORDER_STATUSES}
            />
            {allowedTransitions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {allowedTransitions.map((status) => (
                  <Button
                    key={status}
                    variant="outline"
                    size="xs"
                    onClick={() => handleStatusChange(status)}
                  >
                    Move to {ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]
                      ? status.charAt(0) + status.slice(1).toLowerCase()
                      : status.toLowerCase()}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/dashboard/customers/${order.customer.id}`}
              className="font-medium hover:underline"
            >
              {order.customer.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {order.customer.phone}
            </p>
            {order.customer.address && (
              <p className="mt-1 text-sm text-muted-foreground">
                {order.customer.address}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statusTimeline.map((step, index) => (
                <div key={step.status} className="flex items-center gap-2">
                  <div
                    className={`size-2 rounded-full ${
                      index === statusTimeline.length - 1
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                  <span className="text-sm">{step.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Variant
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    SKU
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right">
                    Price
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-center">
                    Qty
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">
                      {item.variant.product.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.variant.color} / {item.variant.size}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {item.variant.sku}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(Number(item.price))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(Number(item.subtotal))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-right font-medium">
                    Subtotal
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(Number(order.subtotal))}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-right font-medium">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    {formatCurrency(Number(order.total))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Printable Invoice (hidden unless printing) */}
      <div className="hidden print:block">
        <InvoiceContent order={order} />
      </div>
    </div>
  );
}

function InvoiceContent({ order }: { order: OrderDetailData }) {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Aara Clothing</h1>
        <p className="text-muted-foreground">Invoice</p>
      </div>
      <div className="flex justify-between mb-6">
        <div>
          <p className="font-semibold">Order: {order.orderNumber}</p>
          <p className="text-sm text-muted-foreground">
            Date: {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{order.customer.name}</p>
          <p className="text-sm text-muted-foreground">
            {order.customer.phone}
          </p>
          {order.customer.address && (
            <p className="text-sm text-muted-foreground">
              {order.customer.address}
            </p>
          )}
        </div>
      </div>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-t">
            <th className="py-2 text-left font-medium">Product</th>
            <th className="py-2 text-left font-medium">Variant</th>
            <th className="py-2 text-right font-medium">Price</th>
            <th className="py-2 text-center font-medium">Qty</th>
            <th className="py-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.variant.product.name}</td>
              <td className="py-2 text-muted-foreground">
                {item.variant.color} / {item.variant.size}
              </td>
              <td className="py-2 text-right">
                {formatCurrency(Number(item.price))}
              </td>
              <td className="py-2 text-center">{item.quantity}</td>
              <td className="py-2 text-right">
                {formatCurrency(Number(item.subtotal))}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="py-2 text-right font-medium">
              Total
            </td>
            <td className="py-2 text-right font-bold">
              {formatCurrency(Number(order.total))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
