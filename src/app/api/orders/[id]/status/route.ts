import { successResponse, errorResponse } from "@/lib/api-response";
import { updateOrderStatus } from "@/features/orders/orders-service";
import { updateOrderStatusSchema } from "@/features/orders/orders-validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const input = updateOrderStatusSchema.parse(body);
    const order = await updateOrderStatus(id, input);
    return successResponse(order, "Order status updated");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
