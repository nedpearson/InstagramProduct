const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const curatedImages = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop', // Analytics/Dashboard
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop', // Charts & Growth
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop', // AI / Tech
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop', // Laptop Coding
  'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1000&auto=format&fit=crop', // Mobile phone social
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop', // Circuit/Tech
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop'  // AI Digital Art
];

async function run() {
  const assets = await prisma.contentAsset.findMany({
    where: { assetType: { in: ['caption', 'reel'] } }
  });
  
  let count = 0;
  
  for (const asset of assets) {
    const title = asset.title.toLowerCase();
    let selectedImage = curatedImages[Math.floor(Math.random() * curatedImages.length)];
    
    // Assign specific images based on keywords
    if (title.includes('funnel') || title.includes('$') || title.includes('income')) {
      selectedImage = curatedImages[0]; // Dashboard
    } else if (title.includes('ai') || title.includes('automation') || title.includes('tool')) {
      selectedImage = curatedImages[2]; // AI
    } else if (title.includes('course') || title.includes('product')) {
      selectedImage = curatedImages[4]; // Phone
    }
    
    let newMetadata = JSON.stringify({ visualUrl: selectedImage });
    
    await prisma.contentAsset.update({
      where: { id: asset.id },
      data: { mediaMetadata: newMetadata }
    });
    count++;
  }

  console.log(`Successfully updated ${count} posts with targeted resonant imagery!`);
  await prisma.$disconnect();
}

run().catch(console.error);
