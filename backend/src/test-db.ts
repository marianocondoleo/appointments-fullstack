import { prisma } from "./prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
      name: "Mariano",
    },
  });

  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
