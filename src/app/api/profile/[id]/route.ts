import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

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
    const userId = parseId(rawId);
    if (!userId)
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
