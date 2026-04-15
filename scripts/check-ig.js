const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  // Update the Instagram account to use real username (no leading @)
  await p.instagramAccount.updateMany({
    where: { username: '@demo_creator' },
    data: {
      username: 'nedpearsonstravel',
      igAccountId: 'ned_pearson_real',
    }
  });

  const updated = await p.instagramAccount.findFirst();
  console.log('Updated:', updated);
  await p.$disconnect();
}

run().catch(console.error);
