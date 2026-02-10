import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/lib/responseHandler";
import { handleError } from "@/lib/errorHandler";

export async function GET() {
  try {
    const bloodBanks = await prisma.bloodBank.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        location: true,
        contact: true,
        availableGroups: true,
      },
    });

    return sendSuccess(bloodBanks);
  } catch (error) {
    return handleError(error, "GET /api/blood-banks");
  }
}
