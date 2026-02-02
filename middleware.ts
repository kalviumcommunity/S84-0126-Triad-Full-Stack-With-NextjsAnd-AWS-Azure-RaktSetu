import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Frontend route protection (existing logic)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/users")) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // API route authorization
  if (pathname.startsWith("/api/users") || pathname.startsWith("/api/admin")) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing token",
          error: { code: "UNAUTHORIZED" },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          message: "Server error",
          error: { code: "INTERNAL_ERROR", details: { missing: "JWT_SECRET" } },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    let decoded: { id: number; email: string; role: string } | null = null;
    try {
      decoded = jwt.verify(token, secret) as {
        id: number;
        email: string;
        role: string;
      };
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
          error: { code: "FORBIDDEN" },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Role-based access control
    if (pathname.startsWith("/api/admin")) {
      if (decoded.role !== "admin") {
        return NextResponse.json(
          {
            success: false,
            message: "Access denied",
            error: { code: "FORBIDDEN" },
            timestamp: new Date().toISOString(),
          },
          { status: 403 }
        );
      }
    }

    // Attach user info to request headers for route handlers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-email", decoded.email);
    requestHeaders.set("x-user-role", decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/api/users/:path*",
    "/api/admin/:path*",
  ],
};
