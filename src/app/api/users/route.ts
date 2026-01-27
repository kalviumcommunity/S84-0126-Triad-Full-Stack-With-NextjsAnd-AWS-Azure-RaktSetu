import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
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
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const created = await prisma.user.create({
      data: { name, email, password },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
