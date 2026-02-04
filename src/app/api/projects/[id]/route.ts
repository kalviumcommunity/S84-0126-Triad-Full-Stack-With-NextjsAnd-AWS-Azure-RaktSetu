import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
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

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project)
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );

    return NextResponse.json(project);
  } catch (error) {
    return handleError(error, "GET /api/projects/[id]");
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

    const existing = await prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing)
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return handleError(error, "DELETE /api/projects/[id]");
  }
}
