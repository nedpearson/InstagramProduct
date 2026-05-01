const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteTokens() {
  const result = await prisma.integrationToken.deleteMany({
    where: { provider: 'meta_graph' }
  });
  console.log(`Deleted ${result.count} tokens.`);
}

deleteTokens().catch(console.error).finally(() => prisma.$disconnect());
