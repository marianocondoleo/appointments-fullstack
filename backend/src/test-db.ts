// src/test-db.ts
import { prisma } from "./prisma";

async function main() {
  const result = await prisma.$queryRaw`SELECT 1 as ok`;
  console.log(result);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
