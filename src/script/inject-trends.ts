import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const triggers = [
     "Viral hook: The 'Zero-Click' Instagram hack that agencies charge $5k for. Explain that posting manually is a tax on time.",
     "Viral hook: Why your Reels get 200 views (and how the 1% fix it). Break down manual posting vs SEO-indexed automated posting.",
     "Viral hook: If you hired a Social Media Manager in 2026, you've already lost. Outline how 1 person with AI leverage outworks 5 humans."
  ];

  let campaign = await prisma.campaign.findFirst();
  if(!campaign) { console.error("No active campaign"); return; }

  for(const trigger of triggers) {
     await prisma.backgroundJob.create({
        data: {
           jobType: 'generate_content',
           payload: JSON.stringify({ campaignId: campaign.id, assetType: trigger }),
           status: 'pending',
           maxAttempts: 3,
           runAt: new Date()
        }
     });
     console.log("Injected trigger into generation queue:", trigger);
  }
}
main().catch(console.error).finally(()=> prisma.$disconnect());
