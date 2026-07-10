import { successResponse, errorResponse } from "@/lib/api-response";
import { createOrder } from "@/features/orders/orders-service";
import { createOrderSchema } from "@/features/orders/orders-validation";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const input = createOrderSchema.parse(body);
    const order = await createOrder(input, session.user.id);
    return successResponse(order, "Order created", 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
