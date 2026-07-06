import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { STOCK_THRESHOLDS } from "@/lib/constants";
import { DashboardWidgets } from "@/features/dashboard/dashboard-widgets";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [
    totalProducts,
    totalVariants,
    totalCustomers,
    stockAggregation,
    lowStockProducts,
    outOfStockProducts,
  ] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.productVariant.count({
      where: { product: { deletedAt: null } },
    }),
    prisma.customer.count(),
    prisma.productVariant.aggregate({
      where: { product: { deletedAt: null } },
      _sum: { stock: true },
    }),
    prisma.productVariant.count({
      where: {
        product: { deletedAt: null },
        stock: { gt: STOCK_THRESHOLDS.OUT, lte: STOCK_THRESHOLDS.LOW },
      },
    }),
    prisma.productVariant.count({
      where: {
        product: { deletedAt: null },
        stock: { equals: STOCK_THRESHOLDS.OUT },
      },
    }),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.username}
        </p>
      </div>
      <DashboardWidgets
        stats={{
          totalProducts,
          totalVariants,
          totalCustomers,
          totalStockUnits: stockAggregation._sum.stock ?? 0,
          lowStockProducts,
          outOfStockProducts,
        }}
      />
    </div>
  );
}
