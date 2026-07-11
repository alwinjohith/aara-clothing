import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { getVariantStock, updateStock, adjustStock } from "@/features/inventory/inventory-service";
import { updateStockSchema, adjustStockSchema } from "@/features/inventory/inventory-validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    const variant = await getVariantStock(id);
    if (!variant) return errorResponse("Variant not found", 404);
    return successResponse(variant);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    const body = await request.json();

    if (body.type === "adjust") {
      const input = adjustStockSchema.parse(body);
      const variant = await adjustStock(id, input.amount);
      if (!variant) return errorResponse("Variant not found", 404);
      return successResponse(variant, "Stock adjusted");
    }

    const input = updateStockSchema.parse(body);
    const variant = await updateStock(id, input);
    if (!variant) return errorResponse("Variant not found", 404);
    return successResponse(variant, "Stock updated");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
