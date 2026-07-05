import { prisma } from "@/lib/prisma";
import type { ProductQuery, CreateProductInput, UpdateProductInput } from "./products-validation";

export async function listProducts(query: ProductQuery) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deletedAt: null };

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: {
          select: { id: true, name: true },
        },
        _count: { select: { variants: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string) {
  return prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: {
      category: {
        select: { id: true, name: true },
      },
      variants: {
        include: {
          images: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function createProduct(input: CreateProductInput) {
  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, deletedAt: null },
  });
  if (!category) throw new Error("Category not found");

  return prisma.product.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      categoryId: input.categoryId,
      isActive: input.isActive ?? true,
    },
    include: {
      category: { select: { id: true, name: true } },
    },
  });
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const existing = await prisma.product.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return null;

  if (input.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: input.categoryId, deletedAt: null },
    });
    if (!category) throw new Error("Category not found");
  }

  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.description !== undefined) data.description = input.description;
  if (input.categoryId !== undefined) data.categoryId = input.categoryId;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: { select: { id: true, name: true } },
    },
  });
}

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return null;

  return prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
