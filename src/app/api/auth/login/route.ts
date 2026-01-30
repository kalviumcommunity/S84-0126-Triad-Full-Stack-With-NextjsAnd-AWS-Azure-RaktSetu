import { ERROR_CODES } from "@/lib/errorCodes";
import { sendError, sendSuccess } from "@/lib/responseHandler";
import { loginSchema } from "@/lib/schemas/authSchema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return sendError(
        "Invalid input",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        parsed.error.flatten()
      );
    }

    const email = parsed.data.email.trim();
    const password = parsed.data.password;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!user) {
      return sendError("User not found", ERROR_CODES.NOT_FOUND, 404);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return sendError("Invalid password", "INVALID_PASSWORD", 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return sendError("Server error", ERROR_CODES.INTERNAL_ERROR, 500, {
        missing: "JWT_SECRET",
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "1h",
    });

    return sendSuccess({ token });
  } catch {
    return sendError("Bad request", ERROR_CODES.VALIDATION_ERROR, 400);
  }
}
