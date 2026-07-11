import { prisma } from "@/lib/prisma";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQuery,
} from "./categories-validation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function listCategories(query: CategoryQuery) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.category.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      parent: { select: { id: true, name: true } },
      children: { select: { id: true, name: true } },
    },
  });
}

export async function getCategoryTree() {
  const all = await prisma.category.findMany({
    include: {
      parent: { select: { id: true, name: true } },
    },
    orderBy: { name: "asc" },
  });

  return all;
}

export async function createCategory(input: CreateCategoryInput) {
  const slug = slugify(input.name);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    throw new Error("A category with a similar name already exists");
  }

  if (input.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: input.parentId } });
    if (!parent) throw new Error("Parent category not found");
  }

  return prisma.category.create({
    data: {
      name: input.name,
      slug,
      parentId: input.parentId ?? null,
    },
  });
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new Error("Category not found");

  if (input.parentId === id) {
    throw new Error("A category cannot be its own parent");
  }

  if (input.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: input.parentId } });
    if (!parent) throw new Error("Parent category not found");
  }

  const slug = slugify(input.name);
  if (slug !== existing.slug) {
    const slugTaken = await prisma.category.findUnique({ where: { slug } });
    if (slugTaken) {
      throw new Error("A category with a similar name already exists");
    }
  }

  return prisma.category.update({
    where: { id },
    data: {
      name: input.name,
      slug,
      parentId: input.parentId ?? null,
    },
  });
}

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true, children: true } } },
  });
  if (!existing) throw new Error("Category not found");

  if (existing._count.products > 0) {
    throw new Error("Cannot delete category with associated products");
  }

  if (existing._count.children > 0) {
    throw new Error("Cannot delete category with subcategories");
  }

  return prisma.category.delete({ where: { id } });
}
