import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/lib/responseHandler";
import { headers } from "next/headers";
import { handleError } from "@/lib/errorHandler";

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
  } catch (error) {
    return handleError(error, "GET /api/admin");
  }
}
