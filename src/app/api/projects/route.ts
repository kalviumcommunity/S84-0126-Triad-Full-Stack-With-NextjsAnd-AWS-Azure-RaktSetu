import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
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
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user)
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );

    const created = await prisma.project.create({
      data: { title, userId },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
