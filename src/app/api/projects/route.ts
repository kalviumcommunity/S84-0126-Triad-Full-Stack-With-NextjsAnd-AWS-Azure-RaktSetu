import { prisma } from "@/lib/prisma";
import { ERROR_CODES } from "@/lib/errorCodes";
import { sendError, sendSuccess } from "@/lib/responseHandler";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: "asc" },
    });

    return sendSuccess(projects);
  } catch {
    return sendError("Server error", ERROR_CODES.INTERNAL_ERROR, 500);
  }
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    const title =
      typeof (body as { title?: unknown }).title === "string"
        ? (body as { title: string }).title.trim()
        : "";
    const userIdRaw = (body as { userId?: unknown }).userId;
    const userId =
      typeof userIdRaw === "number"
        ? userIdRaw
        : typeof userIdRaw === "string"
          ? Number.parseInt(userIdRaw, 10)
          : NaN;

    if (!title || !Number.isFinite(userId) || userId <= 0) {
      return sendError("Invalid input", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user)
      return sendError("Resource not found", ERROR_CODES.NOT_FOUND, 404);

    const created = await prisma.project.create({
      data: { title, userId },
    });

    return sendSuccess(created, "Success", 201);
  } catch {
    return sendError("Server error", ERROR_CODES.INTERNAL_ERROR, 500);
  }
}
