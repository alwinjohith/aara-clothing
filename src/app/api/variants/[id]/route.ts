import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { getVariantById, updateVariant, deleteVariant } from "@/features/variants/variants-service";
import { updateVariantSchema } from "@/features/variants/variants-validation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    const variant = await getVariantById(id);
    if (!variant) return errorResponse("Variant not found", 404);
    return successResponse(variant);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    const body = await request.json();
    const input = updateVariantSchema.parse(body);
    const variant = await updateVariant(id, input);
    if (!variant) return errorResponse("Variant not found", 404);
    return successResponse(variant, "Variant updated");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    const variant = await deleteVariant(id);
    if (!variant) return errorResponse("Variant not found", 404);
    return successResponse(null, "Variant deleted");
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
