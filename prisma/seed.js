import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    await prisma.user.createMany({
      data: [
        {
          name: "Admin",
          email: "admin@raktsetu.com",
          password: "hashed_admin_password",
        },
        {
          name: "Test User",
          email: "test@raktsetu.com",
          password: "hashed_test_password",
        },
      ],
    });

    console.log("Seed data inserted successfully");
  } else {
    console.log("Seed data already exists, skipping");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
