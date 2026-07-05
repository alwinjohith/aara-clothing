import { successResponse, errorResponse } from "@/lib/api-response";
import { getCategoryById, updateCategory, deleteCategory } from "@/features/categories/categories-service";
import { updateCategorySchema } from "@/features/categories/categories-validation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const category = await getCategoryById(id);
    if (!category) return errorResponse("Category not found", 404);
    return successResponse(category);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const input = updateCategorySchema.parse(body);
    const category = await updateCategory(id, input);
    if (!category) return errorResponse("Category not found", 404);
    return successResponse(category, "Category updated");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const category = await deleteCategory(id);
    if (!category) return errorResponse("Category not found", 404);
    return successResponse(null, "Category deleted");
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
