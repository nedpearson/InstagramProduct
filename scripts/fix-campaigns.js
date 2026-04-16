const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function fixCampaigns() {
  console.log('🚀 Fixing Campaigns to ensure each Product has its own separate Launch Campaign...');

  // 1. Get workspace
  const workspace = await p.workspace.findFirst();
  if (!workspace) {
    console.error('No workspace');
    process.exit(1);
  }

  // 2. Get all products (excluding the original Growth Masterclass maybe, or just get all)
  const products = await p.product.findMany();

  let campaignsCreated = 0;
  let assetsMoved = 0;

  for (const product of products) {
    // Check if campaign already exists for this product
    let campaign = await p.campaign.findFirst({
      where: { productId: product.id }
    });

    if (!campaign) {
      // Create campaign for this product
      campaign = await p.campaign.create({
        data: {
          workspaceId: workspace.id,
          productId: product.id,
          name: `${product.name} Launch`,
          status: 'active',
          startDate: new Date(),
        }
      });
      campaignsCreated++;
      console.log(`✅ Created campaign: ${campaign.name}`);
    }

    // Now, find the assets that belong to this product. Wait, how do I know which assets belong to which product?
    // In my previous script, I can match asset titles based on my PRODUCTS array!
    
  }

  // It's probably easier to map from the PRODUCTS array from seed-10-products.js
  const PRODUCTS = [
    { name: 'Local Business Instagram Accelerator', titles: ['The Local Business IG Secret', 'The Foot Traffic Formula Reel'] },
    { name: 'Faceless Brand Blueprints', titles: ['The No-Face 10k Blueprint', 'Faceless Reels That Go Viral'] },
    { name: 'Real Estate Agent Instagram System', titles: ['The Real Estate IG Listing Machine', 'The Open House Reel Strategy'] },
    { name: 'Instagram in 30 Minutes a Week', titles: ['Instagram in 30 Minutes a Week', 'The Sunday Batch System Reel'] },
    { name: 'Instagram for Therapists & Mental Health Coaches', titles: ['The Ethical Therapist IG Strategy'] },
    { name: 'DM Automation Sales Machine', titles: ['The DM Machine Blueprint', 'The Keyword DM Trigger Reel'] },
    { name: 'LinkedIn-to-Instagram Crossover System', titles: ['The LinkedIn Professional IG Crossover'] },
    { name: 'Restaurant & Food Business Instagram Playbook', titles: ['The Restaurant Instagram Formula'] },
    { name: 'Instagram Reels for Introverts', titles: ['Reels for Introverts System'] },
    { name: 'Instagram for Tech Founders & SaaS Creators', titles: ['The Build-in-Public Instagram Blueprint'] },
  ];

  for (const pMeta of PRODUCTS) {
    const product = await p.product.findFirst({ where: { name: pMeta.name } });
    if (!product) continue;

    const campaign = await p.campaign.findFirst({ where: { productId: product.id } });
    if (!campaign) continue;

    // Move assets
    for (const title of pMeta.titles) {
      const updated = await p.contentAsset.updateMany({
        where: { title: title },
        data: { campaignId: campaign.id }
      });
      assetsMoved += updated.count;
    }
  }

  console.log(`\n🎉 FIXED!`);
  console.log(`Campaigns Created: ${campaignsCreated}`);
  console.log(`Assets Moved to correct campaigns: ${assetsMoved}`);
  
  await p.$disconnect();
}

fixCampaigns().catch(console.error);
