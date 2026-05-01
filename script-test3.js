const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const tokenRecord = await prisma.integrationToken.findFirst({ where: { provider: 'meta_graph' } });
  if (tokenRecord) {
    const token = tokenRecord.encryptedToken;
    console.log('Testing DB Token...');
    const res = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${token}`);
    const data = await res.json();
    console.log('Graph API response:', JSON.stringify(data));
  } else {
    console.log('No DB token found.');
  }
}
main().finally(() => prisma.$disconnect());
