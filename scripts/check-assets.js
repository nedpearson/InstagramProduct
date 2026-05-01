const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const assets = await prisma.contentAsset.findMany();
  console.log('Total Assets:', assets.length);
  
  for (const asset of assets) {
    console.log(`Asset ID: ${asset.id}`);
    console.log(`Title: ${asset.title}`);
    console.log(`Notes (Caption): ${asset.notes?.slice(0, 100)}...`);
    console.log(`MediaMetadata: ${asset.mediaMetadata}`);
    console.log(`Status: ${asset.status}`);
    console.log('---');
  }

  await prisma.$disconnect();
}

run().catch(console.error);
