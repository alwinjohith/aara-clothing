import { Suspense } from "react";
<<<<<<< HEAD
import Link from "next/link";
import { listProducts } from "@/features/inventory/inventory-service";
import { productQuerySchema } from "@/features/inventory/inventory-validation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductTable } from "@/features/inventory/product-table";
import type { Product } from "@/types";
=======
import { listInventory } from "@/features/inventory/inventory-service";
import { inventoryQuerySchema } from "@/features/inventory/inventory-validation";
import { InventoryTable } from "@/features/inventory/inventory-table";
import { Boxes } from "lucide-react";
>>>>>>> f2172a4 (added settings)

interface ProductRow {
  id: string;
  name: string;
  variantCount: number;
  isActive: boolean;
  createdAt: Date;
}

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function InventoryPage({ searchParams }: Props) {
  const { page, search } = await searchParams;
  const query = productQuerySchema.parse({
    page: page ? Number(page) : 1,
    limit: 20,
    search,
  });

  const result = await listProducts(query);

  const rows: ProductRow[] = result.data.map((p) => ({
    id: p.id,
    name: p.name,
    variantCount: (p as Product & { _count?: { variants: number } })._count?.variants ?? 0,
    isActive: p.isActive,
    createdAt: p.createdAt,
  }));

  return (
<<<<<<< HEAD
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Inventory</h2>
          <p className="text-sm text-muted-foreground">
            Manage your products and stock levels
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/inventory/stock">
            <Button variant="outline">Manage Stock</Button>
          </Link>
          <Link href="/dashboard/inventory/new">
            <Button>
              <Plus className="size-4" />
              New Product
            </Button>
          </Link>
        </div>
=======
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl gradient-accent">
          <Boxes className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage stock levels for all product variants
          </p>
        </div>
>>>>>>> f2172a4 (added settings)
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProductTable
          data={rows}
          page={result.page}
          totalPages={result.totalPages}
          search={query.search ?? ""}
        />
      </Suspense>
    </div>
  );
}
