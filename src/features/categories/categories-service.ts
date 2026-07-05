import { prisma } from "@/lib/prisma";
import type { CategoryQuery, CreateCategoryInput, UpdateCategoryInput } from "./categories-validation";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    || "category";
}

async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing || (excludeId && existing.id === excludeId)) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
}

export async function listCategories(query: CategoryQuery) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deletedAt: null };

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
        _count: { select: { children: true, products: true } },
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
  return prisma.category.findFirst({
    where: { id, deletedAt: null },
    include: {
      parent: { select: { id: true, name: true } },
      children: {
        where: { deletedAt: null },
        select: { id: true, name: true },
      },
    },
  });
}

export async function getCategoryTree() {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, slug: true, parentId: true },
    orderBy: { name: "asc" },
  });
  return categories;
}

async function isDescendant(id: string, ancestorId: string): Promise<boolean> {
  if (id === ancestorId) return true;

  const child = await prisma.category.findUnique({
    where: { id },
    select: { parentId: true },
  });

  if (!child?.parentId) return false;
  return isDescendant(child.parentId, ancestorId);
}

export async function createCategory(input: CreateCategoryInput) {
  const slug = await generateUniqueSlug(input.name);

  return prisma.category.create({
    data: {
      name: input.name,
      slug,
      parentId: input.parentId ?? null,
    },
    include: {
      parent: { select: { id: true, name: true } },
    },
  });
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const existing = await prisma.category.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return null;

  if (input.parentId) {
    const wouldBeDescendant = await isDescendant(input.parentId, id);
    if (wouldBeDescendant) {
      throw new Error("Cannot set a descendant as parent");
    }
  }

  const data: Record<string, unknown> = {};

  if (input.name !== undefined) {
    data.name = input.name;
    data.slug = await generateUniqueSlug(input.name, id);
  }

  if (input.parentId !== undefined) {
    data.parentId = input.parentId || null;
  }

  return prisma.category.update({
    where: { id },
    data,
    include: {
      parent: { select: { id: true, name: true } },
    },
  });
}

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return null;

  return prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
