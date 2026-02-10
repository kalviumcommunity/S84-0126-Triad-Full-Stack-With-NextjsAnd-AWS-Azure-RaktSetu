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

    const appointments = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        date: true,
        time: true,
        location: true,
        status: true,
        createdAt: true,
      },
    });

    return sendSuccess(appointments);
  } catch (error) {
    return handleError(error, "GET /api/appointments");
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
    const { date, time, location } = body as {
      date?: string;
      time?: string;
      location?: string;
    };

    if (!date || !time || !location) {
      return sendError(
        "Date, time, and location are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const created = await prisma.appointment.create({
      data: {
        userId,
        date,
        time,
        location,
      },
      select: {
        id: true,
        date: true,
        time: true,
        location: true,
        status: true,
        createdAt: true,
      },
    });

    return sendSuccess(created, "Appointment booked", 201);
  } catch (error) {
    return handleError(error, "POST /api/appointments");
  }
}
