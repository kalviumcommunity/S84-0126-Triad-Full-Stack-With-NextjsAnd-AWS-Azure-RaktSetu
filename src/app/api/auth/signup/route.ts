import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { ERROR_CODES } from "@/lib/errorCodes";
import { sendError, sendSuccess } from "@/lib/responseHandler";
import { signupSchema } from "@/lib/schemas/authSchema";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return sendError(
        "Invalid input",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        parsed.error.flatten()
      );
    }

    const name = parsed.data.name.trim();
    const email = parsed.data.email.trim();
    const password = parsed.data.password;

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return sendError(
        "User already exists",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true },
    });

    return sendSuccess(created, "Success", 201);
  } catch {
    return sendError("Server error", ERROR_CODES.INTERNAL_ERROR, 500);
  }
}
