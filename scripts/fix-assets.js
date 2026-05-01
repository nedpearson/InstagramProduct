const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const assets = await prisma.contentAsset.findMany({
    where: { assetType: { in: ['caption', 'reel'] } }
  });
  
  let count = 0;
  
  for (const asset of assets) {
    let updated = false;
    let newNotes = asset.notes;
    let newMetadata = asset.mediaMetadata;
    
    // Fix missing captions
    if (!asset.notes || asset.notes.trim() === '' || asset.notes === 'undefined') {
      newNotes = `${asset.title}\n\nStop wasting hours on manual posting. Discover how you can fully automate your Instagram content pipeline so you can focus on building your business.\n\nReady to build your autonomous machine? Link in bio to access the InstaFlow 2026 Pipeline: https://instaflow.bridgebox.ai`;
      updated = true;
    }
    
    // Fix missing media
    if (!asset.mediaMetadata) {
      newMetadata = JSON.stringify({ visualUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop' });
      updated = true;
    }
    
    if (updated) {
      await prisma.contentAsset.update({
        where: { id: asset.id },
        data: { notes: newNotes, mediaMetadata: newMetadata }
      });
      count++;
    }
  }

  console.log(`Successfully fixed and enriched ${count} posts!`);
  await prisma.$disconnect();
}

run().catch(console.error);
