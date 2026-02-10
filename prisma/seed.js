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
    console.log("User seed data already exists, skipping");
  }

  // Seed campaigns
  const campaignCount = await prisma.campaign.count();
  if (campaignCount === 0) {
    await prisma.campaign.createMany({
      data: [
        {
          title: "World Blood Donor Day Drive",
          date: "2026-06-14",
          location: "City Hospital, Mumbai",
          organizer: "Red Cross Society",
        },
        {
          title: "Community Blood Donation Camp",
          date: "2026-03-20",
          location: "Town Hall, Delhi",
          organizer: "RaktSetu Foundation",
        },
        {
          title: "Corporate Blood Drive",
          date: "2026-04-10",
          location: "Tech Park, Bangalore",
          organizer: "HealthFirst NGO",
        },
        {
          title: "University Blood Donation Week",
          date: "2026-05-05",
          location: "State University Campus, Pune",
          organizer: "NSS Chapter",
        },
      ],
    });
    console.log("Campaign seed data inserted");
  }

  // Seed blood banks
  const bloodBankCount = await prisma.bloodBank.count();
  if (bloodBankCount === 0) {
    await prisma.bloodBank.createMany({
      data: [
        {
          name: "Central Blood Bank",
          location: "MG Road, Mumbai",
          contact: "+91-22-1234-5678",
          availableGroups: "A+, A-, B+, B-, O+, O-, AB+, AB-",
        },
        {
          name: "City Hospital Blood Centre",
          location: "Ring Road, Delhi",
          contact: "+91-11-9876-5432",
          availableGroups: "A+, B+, O+, AB+",
        },
        {
          name: "LifeLine Blood Bank",
          location: "Koramangala, Bangalore",
          contact: "+91-80-5555-1234",
          availableGroups: "A+, A-, B+, O+, O-",
        },
        {
          name: "RedDrop Foundation",
          location: "Baner, Pune",
          contact: "+91-20-4444-7890",
          availableGroups: "B+, B-, O+, AB+, AB-",
        },
        {
          name: "Government Blood Storage",
          location: "Civil Lines, Jaipur",
          contact: "+91-141-2222-3333",
          availableGroups: "A+, B+, O+, O-",
        },
      ],
    });
    console.log("Blood bank seed data inserted");
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
