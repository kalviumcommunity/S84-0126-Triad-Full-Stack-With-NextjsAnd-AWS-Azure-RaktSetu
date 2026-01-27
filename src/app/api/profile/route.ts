import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    const userIdRaw = (body as { userId?: unknown }).userId;
    const bio =
      typeof (body as { bio?: unknown }).bio === "string"
        ? (body as { bio: string }).bio.trim()
        : "";

    const userId =
      typeof userIdRaw === "number"
        ? userIdRaw
        : typeof userIdRaw === "string"
          ? Number.parseInt(userIdRaw, 10)
          : NaN;

    if (!Number.isFinite(userId) || userId <= 0 || !bio) {
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

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });
    if (existingProfile) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const created = await prisma.profile.create({
      data: { userId, bio },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
