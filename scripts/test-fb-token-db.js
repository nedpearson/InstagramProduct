const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testToken() {
  const tokenRecord = await prisma.integrationToken.findFirst({
    where: { provider: 'meta_graph' },
    orderBy: { createdAt: 'desc' }
  });
  
  if (!tokenRecord) throw new Error('No token found');
  const token = tokenRecord.encryptedToken;

  const res = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${token}`);
  const data = await res.json();
  console.log("Pages Data:", JSON.stringify(data, null, 2));
}

testToken().catch(console.error).finally(() => prisma.$disconnect());
