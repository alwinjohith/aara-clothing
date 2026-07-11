import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/features/settings/settings-validation";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Validation failed";
      return errorResponse(errorMessage, 400);
    }

    const { name } = result.data;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: { id: true, name: true, username: true },
    });

    return successResponse(updatedUser, "Profile updated successfully");
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
