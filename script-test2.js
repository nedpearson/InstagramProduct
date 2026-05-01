const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const accounts = await prisma.instagramAccount.findMany();
  console.log('IG Accounts:', accounts);
  const tokens = await prisma.integrationToken.findMany();
  console.log('Integration Tokens:', tokens);
  
  // also let's fetch to see what the graph api returns for the env token
  const token = process.env.META_ADS_ACCESS_TOKEN;
  console.log('Env token exists:', !!token);
  if (token) {
    const res = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${token}`);
    const data = await res.json();
    console.log('Graph API response:', JSON.stringify(data));
  }
}
main().finally(() => prisma.$disconnect());
