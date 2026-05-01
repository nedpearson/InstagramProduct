const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const accounts = await prisma.instagramAccount.findMany();
  console.log(accounts);

  const tokens = await prisma.integrationToken.findMany({ where: { provider: 'meta_graph' } });
  console.log('Tokens:', tokens.length);

  await prisma.$disconnect();
}
run();
