import { successResponse, errorResponse } from "@/lib/api-response";
import { uploadImages } from "@/features/images/image-service";
import { addImageToVariant } from "@/features/variants/variants-service";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const variant = await prisma.productVariant.findUnique({
      where: { id },
      include: { product: { select: { deletedAt: true } } },
    });

    if (!variant || variant.product.deletedAt) {
      return errorResponse("Variant not found", 404);
    }

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (files.length === 0) {
      return errorResponse("No images provided", 400);
    }

    const urls = await uploadImages(files, id);

    await Promise.all(urls.map((url) => addImageToVariant(id, url)));

    return successResponse({ urls }, "Images uploaded", 201);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
