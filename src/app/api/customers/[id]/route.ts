import { successResponse, errorResponse } from "@/lib/api-response";
import { getCustomerById, updateCustomer, deleteCustomer } from "@/features/customers/customers-service";
import { updateCustomerSchema } from "@/features/customers/customers-validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await getCustomerById(id);
    if (!customer) return errorResponse("Customer not found", 404);
    return successResponse(customer);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const input = updateCustomerSchema.parse(body);
    const customer = await updateCustomer(id, input);
    if (!customer) return errorResponse("Customer not found", 404);
    return successResponse(customer, "Customer updated");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await deleteCustomer(id);
    if (!customer) return errorResponse("Customer not found", 404);
    return successResponse(null, "Customer deleted");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}
