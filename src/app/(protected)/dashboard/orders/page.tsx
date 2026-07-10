import { Suspense } from "react";
import Link from "next/link";
import { listOrders } from "@/features/orders/orders-service";
import { orderQuerySchema } from "@/features/orders/orders-validation";
import { OrdersTable } from "@/features/orders/orders-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = orderQuerySchema.parse({
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    search: params.search ?? "",
    status: params.status ?? "",
  });

  const result = await listOrders(query);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button>
            <Plus className="size-4 mr-2" />
            Create Order
          </Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <OrdersTable
          data={result.data}
          page={result.page}
          totalPages={result.totalPages}
          search={query.search ?? ""}
          statusFilter={query.status ?? ""}
        />
      </Suspense>
    </div>
  );
}
