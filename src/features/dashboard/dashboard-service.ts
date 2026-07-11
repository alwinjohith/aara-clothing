import { prisma } from "@/lib/prisma";
import { STOCK_THRESHOLDS } from "@/lib/constants";

export async function getDashboardStats() {
  const [
    totalProducts,
    totalVariants,
    totalCustomers,
    stockAggregation,
    lowStockProducts,
    outOfStockProducts,
<<<<<<< HEAD
    completedOrders,
=======
    todayOrders,
    pendingOrders,
    processingOrders,
    deliveredOrders,
>>>>>>> f2172a4 (added settings)
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
<<<<<<< HEAD
    prisma.order.count({ where: { status: "DONE" } }),
=======
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PROCESSING" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
>>>>>>> f2172a4 (added settings)
  ]);

  return {
    totalProducts,
    totalVariants,
    totalCustomers,
    totalStockUnits: stockAggregation._sum.stock ?? 0,
    lowStockProducts,
    outOfStockProducts,
<<<<<<< HEAD
    completedOrders,
=======
    todayOrders,
    pendingOrders,
    processingOrders,
    deliveredOrders,
>>>>>>> f2172a4 (added settings)
  };
}
