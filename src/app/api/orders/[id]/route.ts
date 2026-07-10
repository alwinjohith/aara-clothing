import { successResponse, errorResponse } from "@/lib/api-response";
import { getOrderById, updateOrder } from "@/features/orders/orders-service";
import { updateOrderSchema } from "@/features/orders/orders-validation";
import { auth } from "@/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) return errorResponse("Order not found", 404);
    return successResponse(order);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    const body = await request.json();
    const input = updateOrderSchema.parse(body);
    const order = await updateOrder(id, input, session.user.id);
    return successResponse(order, "Order updated");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
