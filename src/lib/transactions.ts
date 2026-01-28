import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createUserWithProfile() {
  try {
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const user = await tx.user.create({
          data: {
            name: "Test Donor",
            email: "donor@raktsetu.com",
            password: "hashed_test_password",
          },
        });

        await tx.profile.create({
          data: {
            userId: user.id,
            bio: "",
          },
        });

        return user;
      }
    );

    return result;
  } catch (error) {
    console.error("Transaction failed. Rolled back.", error);
    throw error;
  }
}
