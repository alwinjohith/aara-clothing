import { successResponse, errorResponse } from "@/lib/api-response";
import { listProducts, createProduct } from "@/features/products/products-service";
import { createProductSchema, productQuerySchema } from "@/features/products/products-validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = productQuerySchema.parse(Object.fromEntries(searchParams));
    const result = await listProducts(query);
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
    const body = await request.json();
    const input = createProductSchema.parse(body);
    const product = await createProduct(input);
    return successResponse(product, "Product created", 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
