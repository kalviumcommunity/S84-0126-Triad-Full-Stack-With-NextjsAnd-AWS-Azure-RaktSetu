import { prisma } from "@/lib/prisma";
import { ERROR_CODES } from "@/lib/errorCodes";
import { sendError, sendSuccess } from "@/lib/responseHandler";
import { headers } from "next/headers";

export async function GET() {
  try {
    // Authorization handled by middleware (admin-only access)
    const requestHeaders = await headers();
    const userEmail = requestHeaders.get("x-user-email");
    const userRole = requestHeaders.get("x-user-role");

    // Get admin dashboard data
    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({
      where: { role: "admin" },
    });

    return sendSuccess({
      message: "Admin dashboard data",
      currentUser: {
        email: userEmail,
        role: userRole,
      },
      stats: {
        totalUsers,
        adminUsers,
        regularUsers: totalUsers - adminUsers,
      },
    });
  } catch {
    return sendError("Server error", ERROR_CODES.INTERNAL_ERROR, 500);
  }
}
