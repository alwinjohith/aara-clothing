import { Suspense } from "react";
import Link from "next/link";
import { listCategories } from "@/features/categories/categories-service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <Link href="/dashboard/categories/new">
          <Button>
            <Plus className="size-4" />
            New Category
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesTable
          data={result.data.map((cat: any) => ({
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
