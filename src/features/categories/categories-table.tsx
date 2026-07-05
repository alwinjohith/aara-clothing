"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Column } from "@/components/data-table";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  parentName: string | null;
  productCount: number;
  createdAt: Date;
}

interface Props {
  data: CategoryRow[];
  page: number;
  totalPages: number;
  search: string;
}

export function CategoriesTable({ data, page, totalPages, search }: Props) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  }

  const columns: Column<CategoryRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (item) => (
        <Link
          href={`/dashboard/categories/${item.id}`}
          className="font-medium hover:underline"
        >
          {item.name}
        </Link>
      ),
    },
    {
      key: "parentName",
      header: "Parent",
      cell: (item) => item.parentName ?? <span className="text-muted-foreground">-</span>,
    },
    {
      key: "productCount",
      header: "Products",
      className: "text-center",
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
          <Link href={`/dashboard/categories/${item.id}`}>
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleDelete(item.id)}
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
        placeholder="Search categories..."
      />
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
        emptyMessage="No categories found"
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
