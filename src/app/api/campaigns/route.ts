import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/lib/responseHandler";
import { handleError } from "@/lib/errorHandler";

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { date: "asc" },
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        organizer: true,
        createdAt: true,
      },
    });

    return sendSuccess(campaigns);
  } catch (error) {
    return handleError(error, "GET /api/campaigns");
  }
}
