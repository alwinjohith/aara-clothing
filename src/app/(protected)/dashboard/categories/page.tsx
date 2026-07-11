import { Suspense } from "react";
import Link from "next/link";
import { listCategories } from "@/features/categories/categories-service";
import { Button } from "@/components/ui/button";
import { Plus, Layers } from "lucide-react";
import { CategoriesTable } from "@/features/categories/categories-table";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function CategoriesPage({ searchParams }: Props) {
  const { page, search } = await searchParams;
  const result = await listCategories({
    page: page ? Number(page) : 1,
    limit: 20,
    search,
  });

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl gradient-accent">
            <Layers className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Categories
            </h1>
            <p className="text-sm text-muted-foreground">
              Organize your products
            </p>
          </div>
        </div>
        <Link href="/dashboard/categories/new">
          <Button>
            <Plus className="size-4" />
            New Category
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesTable
          data={result.data.map((cat) => ({
            ...cat,
            parentName: cat.parent?.name ?? null,
            productCount: cat._count?.products ?? 0,
          }))}
          page={result.page}
          totalPages={result.totalPages}
          search={search ?? ""}
        />
      </Suspense>
    </div>
  );
}
