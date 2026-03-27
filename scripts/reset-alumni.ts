import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.member.updateMany({
    data: {
      isAlumni: false,
      alumniSince: null,
    },
  });

  console.log(`Reset ${result.count} members back to active (isAlumni = false).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
