"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Column } from "@/components/data-table";

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  createdAt: Date;
  orderCount: number;
  lastOrderDate: Date | null;
}

interface Props {
  data: CustomerRow[];
  page: number;
  totalPages: number;
  search: string;
}

export function CustomersTable({ data, page, totalPages, search }: Props) {
  const router = useRouter();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      toast.success("Customer deleted successfully");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  const columns: Column<CustomerRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (item) => (
        <Link
          href={`/dashboard/customers/${item.id}`}
          className="font-medium hover:underline"
        >
          {item.name}
        </Link>
      ),
    },
    {
      key: "phone",
      header: "Phone",
    },
    {
      key: "address",
      header: "Address",
      cell: (item) => (
        <span className="text-muted-foreground">
          {item.address ?? "-"}
        </span>
      ),
    },
    {
      key: "orderCount",
      header: "Orders",
      cell: (item) => (
        <span className="font-medium">{item.orderCount}</span>
      ),
    },
    {
      key: "lastOrderDate",
      header: "Last Order",
      cell: (item) => (
        <span className="text-muted-foreground">
          {item.lastOrderDate
            ? new Date(item.lastOrderDate).toLocaleDateString()
            : "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      cell: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/customers/${item.id}`}>
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleDelete(item.id, item.name)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={(val) => {
          const url = new URL(window.location.href);
          url.searchParams.set("search", val);
          url.searchParams.delete("page");
          router.push(url.pathname + url.search);
        }}
        placeholder="Search by name or phone..."
      />
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
        emptyMessage="No customers found"
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
