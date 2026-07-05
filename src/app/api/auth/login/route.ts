import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/features/auth/auth-validation";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Validation failed";
      return errorResponse(errorMessage, 400);
    }

    const { username, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return errorResponse("Invalid username or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return errorResponse("Invalid username or password", 401);
    }

    return successResponse(
      {
        id: user.id,
        username: user.username,
      },
      "Login successful"
    );
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
