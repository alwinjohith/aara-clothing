import { successResponse, errorResponse } from "@/lib/api-response";
import { uploadImages } from "@/features/images/image-service";
import { addImageToVariant } from "@/features/variants/variants-service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: variantId } = await params;
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return errorResponse("No images provided", 400);
    }

    const urls = await uploadImages(files, variantId);

    const images = await Promise.all(
      urls.map((url) => addImageToVariant(variantId, url))
    );

    return successResponse(images, "Images uploaded", 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
