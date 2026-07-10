import { successResponse, errorResponse } from "@/lib/api-response";
import { deleteImage } from "@/features/images/image-service";
import { deleteImageFromVariant } from "@/features/variants/variants-service";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { imageId } = await params;

    const image = await prisma.variantImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return errorResponse("Image not found", 404);
    }

    await deleteImage(image.url);
    await deleteImageFromVariant(imageId);

    return successResponse(null, "Image deleted");
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
