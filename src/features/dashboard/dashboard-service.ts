import { prisma } from "@/lib/prisma";
import { STOCK_THRESHOLDS, ORDER_STATUSES } from "@/lib/constants";

export async function getDashboardStats() {
  const [
    totalProducts,
    stockAggregation,
    outOfStockProducts,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
  ] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.productVariant.aggregate({
      where: { product: { deletedAt: null } },
      _sum: { stock: true },
    }),
    prisma.productVariant.count({
      where: {
        product: { deletedAt: null },
        stock: { equals: STOCK_THRESHOLDS.OUT },
      },
    }),
    prisma.order.count({
      where: { status: ORDER_STATUSES.PENDING },
    }),
    prisma.order.count({
      where: { status: ORDER_STATUSES.PROCESSING },
    }),
    prisma.order.count({
      where: { status: ORDER_STATUSES.COMPLETED },
    }),
    prisma.order.count({
      where: { status: ORDER_STATUSES.CANCELLED },
    }),
  ]);

  return {
    totalProducts,
    totalStockUnits: stockAggregation._sum.stock ?? 0,
    outOfStockProducts,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
  };
}
