import { prisma } from '../lib/prisma';
import { createBriefWithSectorAction } from '../app/(app)/actions';

async function rebuild() {
  const product = await prisma.product.findFirst();
  if (!product) return console.log('no product');
  
  const brief = await prisma.productBrief.findFirst({
    where: { productId: product.id }
  });
  
  console.log('Purging all old campaigns and data...');
  // Nuke campaigns
  await prisma.campaign.deleteMany({
    where: { productId: product.id }
  });
  
  // Rebuild
  console.log('Rebuilding perfect calendar pipeline...');
  if (brief) {
    await createBriefWithSectorAction(brief.niche || 'Instagram Automated Funnels', brief.ctaKeyword || 'TOOL', true);
    console.log('Done rebuilding! Calendar should be pristine.');
  }
}

rebuild().catch(console.error);
