import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { uploadImages } from "@/features/images/image-service";
import { addImageToVariant } from "@/features/variants/variants-service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id: variantId } = await params;
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return errorResponse("No images provided", 400);
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024;

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return errorResponse(`Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF`, 400);
      }
      if (file.size > maxSize) {
        return errorResponse(`File too large: ${file.name}. Maximum size: 5MB`, 400);
      }
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
