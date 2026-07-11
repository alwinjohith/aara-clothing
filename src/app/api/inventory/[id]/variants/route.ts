import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { listVariants, createVariant } from "@/features/variants/variants-service";
import { createVariantSchema } from "@/features/variants/variants-validation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    const variants = await listVariants(id);
    return successResponse(variants);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    const body = await request.json();
    const input = createVariantSchema.parse({ ...body, productId: id });
    const variant = await createVariant(input);
    return successResponse(variant, "Variant created", 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
