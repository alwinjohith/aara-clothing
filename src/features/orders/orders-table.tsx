"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, XCircle } from "lucide-react";
import { OrderStatusBadge } from "./order-status-badge";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Column } from "@/components/data-table";

interface OrderRow {
  id: string;
  orderNumber: string;
  customer: { id: string; name: string; phone: string };
  status: string;
  _count: { items: number };
  total: number;
  createdAt: Date;
}

interface Props {
  data: OrderRow[];
  page: number;
  totalPages: number;
  search: string;
  statusFilter: string;
}

export function OrdersTable({ data, page, totalPages, search, statusFilter }: Props) {
  const router = useRouter();

  async function handleCancel(id: string) {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: ORDER_STATUSES.CANCELLED }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      toast.success("Order cancelled successfully");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  const columns: Column<OrderRow>[] = [
    {
      key: "orderNumber",
      header: "Order Number",
      cell: (item) => (
        <Link
          href={`/dashboard/orders/${item.id}`}
          className="font-mono text-xs font-medium hover:underline"
        >
          {item.orderNumber}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (item) => (
        <Link
          href={`/dashboard/customers/${item.customer.id}`}
          className="font-medium hover:underline"
        >
          {item.customer.name}
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item) => <OrderStatusBadge status={item.status as keyof typeof ORDER_STATUSES} />,
    },
    {
      key: "items",
      header: "Items",
      className: "text-center",
      cell: (item) => <span>{item._count.items}</span>,
    },
    {
      key: "total",
      header: "Total",
      cell: (item) => <span className="font-medium">{formatCurrency(Number(item.total))}</span>,
    },
    {
      key: "createdAt",
      header: "Created Date",
      cell: (item) => (
        <span className="text-muted-foreground">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/orders/${item.id}`}>
            <Button variant="ghost" size="icon-sm">
              <Eye className="size-4" />
            </Button>
          </Link>
          {(item.status === ORDER_STATUSES.PENDING ||
            item.status === ORDER_STATUSES.PROCESSING) && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleCancel(item.id)}
            >
              <XCircle className="size-4 text-destructive" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            const url = new URL(window.location.href);
            url.searchParams.set("search", val);
            url.searchParams.delete("page");
            router.push(url.pathname + url.search);
          }}
          placeholder="Search by order number or customer name..."
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            const url = new URL(window.location.href);
            if (e.target.value) {
              url.searchParams.set("status", e.target.value);
            } else {
              url.searchParams.delete("status");
            }
            url.searchParams.delete("page");
            router.push(url.pathname + url.search);
          }}
          className="flex h-9 w-40 appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Statuses</option>
          <option value={ORDER_STATUSES.PENDING}>Pending</option>
          <option value={ORDER_STATUSES.PROCESSING}>Processing</option>
          <option value={ORDER_STATUSES.COMPLETED}>Completed</option>
          <option value={ORDER_STATUSES.CANCELLED}>Cancelled</option>
        </select>
      </div>
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
        emptyMessage="No orders found"
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          const url = new URL(window.location.href);
          url.searchParams.set("page", String(p));
          router.push(url.pathname + url.search);
        }}
      />
    </div>
  );
}
