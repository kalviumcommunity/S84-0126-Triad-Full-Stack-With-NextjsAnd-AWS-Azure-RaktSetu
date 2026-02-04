import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ERROR_CODES } from "@/lib/errorCodes";
import { sendError, sendSuccess } from "@/lib/responseHandler";
import { updateUserSchema } from "@/lib/schemas/userSchema";
import { ZodError } from "zod";
import { handleError } from "@/lib/errorHandler";

function parseId(value: string) {
  const id = Number.parseInt(value, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id)
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    if (!user)
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );

    return NextResponse.json(user);
  } catch (error) {
    return handleError(error, "GET /api/users/[id]");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id)
      return sendError("Invalid input", ERROR_CODES.VALIDATION_ERROR, 400);

    const body: unknown = await req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return sendError(
        "Invalid input",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        parsed.error.flatten()
      );
    }

    const name =
      typeof parsed.data.name === "string"
        ? parsed.data.name.trim()
        : undefined;
    const email =
      typeof parsed.data.email === "string"
        ? parsed.data.email.trim()
        : undefined;

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing)
      return sendError("Resource not found", ERROR_CODES.NOT_FOUND, 404);

    const updated = await prisma.user.update({
      where: { id },
      data: { ...(name ? { name } : {}), ...(email ? { email } : {}) },
      select: { id: true, name: true, email: true },
    });

    return sendSuccess(updated);
  } catch (err) {
    if (err instanceof ZodError) {
      return sendError(
        "Invalid input",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        err.flatten()
      );
    }
    return handleError(err, "PUT /api/users/[id]");
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id)
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing)
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return handleError(error, "DELETE /api/users/[id]");
  }
}
