import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { listCategories, createCategory } from "@/features/categories/categories-service";
import { createCategorySchema, categoryQuerySchema } from "@/features/categories/categories-validation";

export async function GET(request: Request) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { searchParams } = new URL(request.url);
    const query = categoryQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
    });

    const result = await listCategories(query);
    return successResponse(result);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const body = await request.json();
    const input = createCategorySchema.parse(body);
    const category = await createCategory(input);
    return successResponse(category, "Category created");
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Internal server error", 500);
  }
}
