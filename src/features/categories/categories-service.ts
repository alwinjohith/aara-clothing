import { prisma } from "@/lib/prisma";

export async function getCategoryTree() {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, slug: true, parentId: true },
    orderBy: { name: "asc" },
  });
  return categories;
}
