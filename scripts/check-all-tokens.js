const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTokens() {
  const tokens = await prisma.integrationToken.findMany();
  console.log(tokens);
  await prisma.$disconnect();
}
checkTokens().catch(console.error);
