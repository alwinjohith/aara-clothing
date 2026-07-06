import { successResponse, errorResponse } from "@/lib/api-response";
import { listInventory } from "@/features/inventory/inventory-service";
import { inventoryQuerySchema } from "@/features/inventory/inventory-validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = inventoryQuerySchema.parse(Object.fromEntries(searchParams));
    const result = await listInventory(query);
    return successResponse(result);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
