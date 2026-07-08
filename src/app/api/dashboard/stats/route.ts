import { successResponse, errorResponse } from "@/lib/api-response";
import { getDashboardStats } from "@/features/dashboard/dashboard-service";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return successResponse(stats);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
