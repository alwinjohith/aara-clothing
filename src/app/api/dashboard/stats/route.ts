import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { STOCK_THRESHOLDS } from "@/lib/constants";

export async function GET() {
  try {
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

    return successResponse({
      totalProducts,
      totalVariants,
      totalCustomers,
      totalStockUnits: stockAggregation._sum.stock ?? 0,
      lowStockProducts,
      outOfStockProducts,
    });
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
