import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { handleError } from "@/lib/errorHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { headers } from "next/headers";

export async function GET() {
  try {
    const reqHeaders = await headers();
    const userId = Number(reqHeaders.get("x-user-id"));
    if (!userId) {
      return sendError("Unauthorized", "UNAUTHORIZED", 401);
    }

    const requests = await prisma.bloodRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        bloodGroup: true,
        quantity: true,
        urgency: true,
        note: true,
        status: true,
        createdAt: true,
      },
    });

    return sendSuccess(requests);
  } catch (error) {
    return handleError(error, "GET /api/requests");
  }
}

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const userId = Number(reqHeaders.get("x-user-id"));
    if (!userId) {
      return sendError("Unauthorized", "UNAUTHORIZED", 401);
    }

    const body = await req.json();
    const { bloodGroup, quantity, urgency, note } = body as {
      bloodGroup?: string;
      quantity?: number;
      urgency?: string;
      note?: string;
    };

    if (!bloodGroup || !quantity) {
      return sendError(
        "Blood group and quantity are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const validGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validGroups.includes(bloodGroup)) {
      return sendError(
        "Invalid blood group",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    if (typeof quantity !== "number" || quantity < 1) {
      return sendError(
        "Quantity must be at least 1",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const created = await prisma.bloodRequest.create({
      data: {
        userId,
        bloodGroup,
        quantity,
        urgency: urgency || "Normal",
        note: note || null,
      },
      select: {
        id: true,
        bloodGroup: true,
        quantity: true,
        urgency: true,
        note: true,
        status: true,
        createdAt: true,
      },
    });

    return sendSuccess(created, "Blood request created", 201);
  } catch (error) {
    return handleError(error, "POST /api/requests");
  }
}
