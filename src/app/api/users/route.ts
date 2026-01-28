import { prisma } from "@/lib/prisma";
import { ERROR_CODES } from "@/lib/errorCodes";
import { sendError, sendSuccess } from "@/lib/responseHandler";

export async function GET() {
  try {
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

    const name =
      typeof (body as { name?: unknown }).name === "string"
        ? (body as { name: string }).name.trim()
        : "";
    const email =
      typeof (body as { email?: unknown }).email === "string"
        ? (body as { email: string }).email.trim()
        : "";
    const password =
      typeof (body as { password?: unknown }).password === "string"
        ? (body as { password: string }).password
        : "";

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
  } catch {
    return sendError("Server error", ERROR_CODES.INTERNAL_ERROR, 500);
  }
}
