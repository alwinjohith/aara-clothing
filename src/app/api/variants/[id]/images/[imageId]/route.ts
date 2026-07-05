import { successResponse, errorResponse } from "@/lib/api-response";
import { deleteImage } from "@/features/images/image-service";
import { deleteImageFromVariant } from "@/features/variants/variants-service";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; imageId: string }> }) {
  try {
    const { imageId } = await params;
    const image = await deleteImageFromVariant(imageId);
    if (!image) return errorResponse("Image not found", 404);

    await deleteImage(image.url);

    return successResponse(null, "Image deleted");
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
