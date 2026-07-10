import { successResponse, errorResponse } from "@/lib/api-response";
import { listOrders, createOrder } from "@/features/orders/orders-service";
import { orderQuerySchema, createOrderSchema } from "@/features/orders/orders-validation";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = orderQuerySchema.parse(Object.fromEntries(searchParams));
    const result = await listOrders(query);
    return successResponse(result);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

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
