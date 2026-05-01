const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const tokens = await prisma.integrationToken.findMany({
    where: { provider: 'meta_graph' }
  });
  console.log('Integration tokens:', JSON.stringify(tokens, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
