import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { handleError } from "@/lib/errorHandler";
import { headers } from "next/headers";

export async function GET() {
  try {
    const reqHeaders = await headers();
    const userId = Number(reqHeaders.get("x-user-id"));
    if (!userId) {
      return sendError("Unauthorized", "UNAUTHORIZED", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bloodGroup: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendError("User not found", "NOT_FOUND", 404);
    }

    return sendSuccess(user);
  } catch (error) {
    return handleError(error, "GET /api/settings");
  }
}

export async function PUT(req: Request) {
  try {
    const reqHeaders = await headers();
    const userId = Number(reqHeaders.get("x-user-id"));
    if (!userId) {
      return sendError("Unauthorized", "UNAUTHORIZED", 401);
    }

    const body = await req.json();
    const { name, phone, bloodGroup } = body as {
      name?: string;
      phone?: string;
      bloodGroup?: string;
    };

    const data: { name?: string; phone?: string; bloodGroup?: string } = {};

    if (name && typeof name === "string" && name.trim()) {
      data.name = name.trim();
    }
    if (typeof phone === "string") {
      data.phone = phone.trim() || (null as unknown as string);
    }
    if (typeof bloodGroup === "string") {
      const validGroups = [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
        "",
      ];
      if (!validGroups.includes(bloodGroup)) {
        return sendError("Invalid blood group", "VALIDATION_ERROR", 400);
      }
      data.bloodGroup = bloodGroup || (null as unknown as string);
    }

    if (Object.keys(data).length === 0) {
      return sendError("No fields to update", "VALIDATION_ERROR", 400);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bloodGroup: true,
        role: true,
        createdAt: true,
      },
    });

    return sendSuccess(updated, "Profile updated");
  } catch (error) {
    return handleError(error, "PUT /api/settings");
  }
}
