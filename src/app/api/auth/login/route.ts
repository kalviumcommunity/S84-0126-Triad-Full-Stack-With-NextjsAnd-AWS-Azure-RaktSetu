import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !email.includes("@") || password.length < 6) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // NOTE: This is a mock authentication for demo purposes.
    // Replace with real DB lookup / password check in production.
    const token = "mock.jwt.token";

    return NextResponse.json({ token });
  } catch (err) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }
}
