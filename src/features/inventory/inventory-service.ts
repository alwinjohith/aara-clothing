import { prisma } from "@/lib/prisma";
import type {
  InventoryQuery,
  UpdateStockInput,
} from "./inventory-validation";

export async function listInventory(query: InventoryQuery) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    product: { deletedAt: null },
  };

  if (search) {
    where.OR = [
      { sku: { contains: search, mode: "insensitive" } },
      { color: { contains: search, mode: "insensitive" } },
      { size: { contains: search, mode: "insensitive" } },
      { product: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.productVariant.findMany({
      where,
      skip,
      take: limit,
      include: {
        product: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productVariant.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getVariantStock(id: string) {
  return prisma.productVariant.findUnique({
    where: { id },
    include: {
      product: {
        select: { id: true, name: true, deletedAt: true },
      },
    },
  });
}

export async function updateStock(id: string, input: UpdateStockInput) {
  const existing = await prisma.productVariant.findUnique({
    where: { id },
    include: {
      product: { select: { deletedAt: true } },
    },
  });

  if (!existing) {
    throw new Error("Variant not found");
  }

  if (existing.product.deletedAt) {
    throw new Error("Cannot update stock for a deleted product");
  }

  return prisma.productVariant.update({
    where: { id },
    data: { stock: input.stock },
    include: {
      product: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function adjustStock(id: string, amount: number) {
  const existing = await prisma.productVariant.findUnique({
    where: { id },
    include: {
      product: { select: { deletedAt: true } },
    },
  });

  if (!existing) {
    throw new Error("Variant not found");
  }

  if (existing.product.deletedAt) {
    throw new Error("Cannot update stock for a deleted product");
  }

  const newStock = existing.stock + amount;

  if (newStock < 0) {
    throw new Error(
      `Insufficient stock. Current stock: ${existing.stock}, adjustment: ${amount}`
    );
  }

  return prisma.productVariant.update({
    where: { id },
    data: { stock: newStock },
    include: {
      product: {
        select: { id: true, name: true },
      },
    },
  });
}
