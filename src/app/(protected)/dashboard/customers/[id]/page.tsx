import { notFound } from "next/navigation";
import Link from "next/link";
import { getCustomerDetail } from "@/features/customers/customers-service";
import { CustomerForm } from "@/features/customers/customer-form";
import { OrderStatusBadge } from "@/features/orders/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/format";
import { ORDER_STATUSES } from "@/lib/constants";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerDetail(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {customer.name}
        </h1>
        <p className="text-muted-foreground">
          {customer.phone} &middot; {customer.address ?? "No address"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(customer.totalSpent)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customer.lastOrderDate
                ? formatDate(customer.lastOrderDate)
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order History</CardTitle>
          <Link href={`/dashboard/orders/new`}>
            <Button size="sm">
              <Plus className="size-4 mr-1" />
              New Order
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {customer.orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No orders yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                      Order
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground text-right">
                      Total
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(customer.orders as Array<{
                    id: string;
                    orderNumber: string;
                    status: string;
                    total: number;
                    createdAt: Date;
                  }>).map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="font-mono text-xs font-medium hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge
                          status={order.status as keyof typeof ORDER_STATUSES}
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(Number(order.total))}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
