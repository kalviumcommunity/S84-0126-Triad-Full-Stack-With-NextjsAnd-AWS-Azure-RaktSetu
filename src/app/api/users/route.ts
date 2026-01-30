import { prisma } from "@/lib/prisma";
import { ERROR_CODES } from "@/lib/errorCodes";
import { sendError, sendSuccess } from "@/lib/responseHandler";
import { createUserSchema } from "@/lib/schemas/userSchema";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";

export async function GET() {
  try {
    const authHeader = (await headers()).get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";
    if (!token) {
      return sendError("Missing token", "UNAUTHORIZED", 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return sendError("Server error", ERROR_CODES.INTERNAL_ERROR, 500, {
        missing: "JWT_SECRET",
      });
    }

    try {
      jwt.verify(token, secret);
    } catch {
      return sendError("Invalid or expired token", "FORBIDDEN", 403);
    }

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { id: "asc" },
    });

    return sendSuccess(users);
  } catch {
    return sendError("Server error", ERROR_CODES.INTERNAL_ERROR, 500);
  }
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    const parsed = createUserSchema.safeParse(body);
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

    if (!name || !email || !password) {
      return sendError(
        "Missing required fields",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const created = await prisma.user.create({
      data: { name, email, password },
      select: { id: true, name: true, email: true },
    });

    return sendSuccess(created, "Success", 201);
  } catch (err) {
    if (err instanceof ZodError) {
      return sendError(
        "Invalid input",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        err.flatten()
      );
    }
    return sendError("Server error", ERROR_CODES.INTERNAL_ERROR, 500);
  }
}
