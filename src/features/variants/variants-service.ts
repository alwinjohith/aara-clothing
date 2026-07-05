import { prisma } from "@/lib/prisma";
import type { CreateVariantInput, UpdateVariantInput } from "./variants-validation";

export async function listVariants(productId: string) {
  return prisma.productVariant.findMany({
    where: { productId },
    include: {
      images: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getVariantById(id: string) {
  return prisma.productVariant.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function createVariant(input: CreateVariantInput) {
  const product = await prisma.product.findFirst({
    where: { id: input.productId, deletedAt: null },
  });
  if (!product) throw new Error("Product not found");

  const existingSku = await prisma.productVariant.findUnique({
    where: { sku: input.sku },
  });
  if (existingSku) throw new Error("SKU already exists");

  return prisma.productVariant.create({
    data: {
      productId: input.productId,
      color: input.color,
      size: input.size,
      sku: input.sku,
      stock: input.stock ?? 0,
    },
    include: {
      images: true,
    },
  });
}

export async function updateVariant(id: string, input: UpdateVariantInput) {
  const existing = await prisma.productVariant.findUnique({ where: { id } });
  if (!existing) return null;

  if (input.sku && input.sku !== existing.sku) {
    const existingSku = await prisma.productVariant.findUnique({
      where: { sku: input.sku },
    });
    if (existingSku) throw new Error("SKU already exists");
  }

  const data: Record<string, unknown> = {};
  if (input.color !== undefined) data.color = input.color;
  if (input.size !== undefined) data.size = input.size;
  if (input.sku !== undefined) data.sku = input.sku;
  if (input.stock !== undefined) data.stock = input.stock;

  return prisma.productVariant.update({
    where: { id },
    data,
    include: {
      images: true,
    },
  });
}

export async function deleteVariant(id: string) {
  const existing = await prisma.productVariant.findUnique({ where: { id } });
  if (!existing) return null;

  return prisma.productVariant.delete({ where: { id } });
}

export async function addImageToVariant(variantId: string, url: string) {
  return prisma.variantImage.create({
    data: { variantId, url },
  });
}

export async function deleteImageFromVariant(imageId: string) {
  const image = await prisma.variantImage.findUnique({ where: { id: imageId } });
  if (!image) return null;

  await prisma.variantImage.delete({ where: { id: imageId } });
  return image;
}
