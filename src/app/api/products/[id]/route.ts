import { successResponse, errorResponse } from "@/lib/api-response";
import { getProductById, updateProduct, deleteProduct } from "@/features/products/products-service";
import { updateProductSchema } from "@/features/products/products-validation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return errorResponse("Product not found", 404);
    return successResponse(product);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const input = updateProductSchema.parse(body);
    const product = await updateProduct(id, input);
    if (!product) return errorResponse("Product not found", 404);
    return successResponse(product, "Product updated");
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
    const product = await deleteProduct(id);
    if (!product) return errorResponse("Product not found", 404);
    return successResponse(null, "Product deleted");
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
