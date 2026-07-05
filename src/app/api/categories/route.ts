import { successResponse, errorResponse } from "@/lib/api-response";
import { listCategories, createCategory } from "@/features/categories/categories-service";
import { createCategorySchema, categoryQuerySchema } from "@/features/categories/categories-validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = categoryQuerySchema.parse(Object.fromEntries(searchParams));
    const result = await listCategories(query);
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
    const input = createCategorySchema.parse(body);
    const category = await createCategory(input);
    return successResponse(category, "Category created", 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
