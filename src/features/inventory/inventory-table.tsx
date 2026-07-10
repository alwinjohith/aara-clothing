"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StockUpdateDialog } from "./stock-update-dialog";
import { getStockStatus, STOCK_STATUS_LABELS } from "@/lib/constants";
import { Pencil } from "lucide-react";
import type { Column } from "@/components/data-table";

interface InventoryRow {
  id: string;
  productId: string;
  product: { id: string; name: string };
  color: string;
  size: string;
  sku: string;
  stock: number;
  createdAt: Date;
}

interface Props {
  data: InventoryRow[];
  page: number;
  totalPages: number;
  search: string;
}

function StockBadge({ stock }: { stock: number }) {
  const status = getStockStatus(stock);
  const variantMap = {
    in_stock: "success" as const,
    low_stock: "warning" as const,
    out_of_stock: "destructive" as const,
  };

  return (
    <Badge variant={variantMap[status]}>
      {STOCK_STATUS_LABELS[status]} ({stock})
    </Badge>
  );
}

export function InventoryTable({ data, page, totalPages, search }: Props) {
  const router = useRouter();
  const [editingVariant, setEditingVariant] = useState<InventoryRow | null>(
    null
  );

  const columns: Column<InventoryRow>[] = [
    {
      key: "product",
      header: "Product",
      cell: (item) => (
        <span className="font-medium">{item.product.name}</span>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      cell: (item) => (
        <span className="font-mono text-xs">{item.sku}</span>
      ),
    },
    {
      key: "color",
      header: "Color",
    },
    {
      key: "size",
      header: "Size",
    },
    {
      key: "stock",
      header: "Stock",
      className: "text-center",
      cell: (item) => <StockBadge stock={item.stock} />,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setEditingVariant(item)}
        >
          <Pencil className="size-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full space-y-4">
      <SearchInput
        value={search}
        onChange={(val) => {
          const url = new URL(window.location.href);
          url.searchParams.set("search", val);
          url.searchParams.delete("page");
          router.push(url.pathname + url.search);
        }}
        placeholder="Search by product, SKU, color, or size..."
      />
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
        emptyMessage="No inventory items found"
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
      {editingVariant && (
        <StockUpdateDialog
          variant={editingVariant}
          open={!!editingVariant}
          onOpenChange={(open) => {
            if (!open) setEditingVariant(null);
          }}
          onUpdated={() => {
            setEditingVariant(null);
            toast.success("Stock updated successfully");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
