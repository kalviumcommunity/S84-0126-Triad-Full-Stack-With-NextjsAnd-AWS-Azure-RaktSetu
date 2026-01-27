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
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
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
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });

    const body: unknown = await req.json();
    const name =
      typeof (body as { name?: unknown }).name === "string"
        ? (body as { name: string }).name.trim()
        : undefined;
    const email =
      typeof (body as { email?: unknown }).email === "string"
        ? (body as { email: string }).email.trim()
        : undefined;

    if (!name && !email) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing)
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );

    const updated = await prisma.user.update({
      where: { id },
      data: { ...(name ? { name } : {}), ...(email ? { email } : {}) },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
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
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
