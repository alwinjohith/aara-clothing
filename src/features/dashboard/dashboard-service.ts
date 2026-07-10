import { prisma } from "@/lib/prisma";
import { STOCK_THRESHOLDS, ORDER_STATUSES } from "@/lib/constants";

export async function getDashboardStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalProducts,
    totalVariants,
    totalCustomers,
    stockAggregation,
    lowStockProducts,
    outOfStockProducts,
    todayOrders,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
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
    prisma.order.count({
      where: { createdAt: { gte: todayStart } },
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
    totalVariants,
    totalCustomers,
    totalStockUnits: stockAggregation._sum.stock ?? 0,
    lowStockProducts,
    outOfStockProducts,
    todayOrders,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
  };
}
