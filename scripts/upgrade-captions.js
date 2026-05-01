const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Contrarian hook bank for fallback updates
const CONTRARIAN_HOOKS = [
  "If you hired a Social Media Manager in 2026, you've already lost.",
  "Posting every day is the #1 reason your account isn't growing.",
  "I fired my entire marketing team. Revenue went up 40%.",
  "The 'Zero-Click' trick that agencies charge $5,000 for.",
  "Stop using Canva. Here's what the top 1% do instead.",
  "Your competitors aren't working harder. They automated everything.",
  "Manual posting is a $50,000/year tax on your time.",
  "The biggest lie in marketing: 'Just post consistently.'",
  "I replaced a $5,000/mo marketing agency with a $29 AI tool.",
  "Everyone is teaching 'content strategy.' No one is teaching automation.",
];

const CTA_SUFFIX = `\n\n💬 Comment 'AUTOMATE' below and I'll DM you the exact blueprint for free.\n🔗 Or grab it directly at the link in bio: https://instaflow.bridgebox.ai`;

async function run() {
  const assets = await prisma.contentAsset.findMany({
    where: { assetType: { in: ['caption', 'reel'] } }
  });

  let count = 0;

  for (const asset of assets) {
    let newNotes = asset.notes;
    let updated = false;

    // Skip auto-reply assets
    if (asset.title?.startsWith('Auto-Reply')) continue;

    // Replace old generic CTA with Comment-to-DM viral loop CTA
    if (newNotes?.includes('Link in bio to access the InstaFlow 2026 Pipeline') || newNotes?.includes('Ready to build your autonomous machine?')) {
      newNotes = newNotes
        .replace(/Ready to build your autonomous machine\? Link in bio to access the InstaFlow 2026 Pipeline: https:\/\/instaflow\.bridgebox\.ai/g, CTA_SUFFIX.trim())
        .replace(/Stop wasting hours on manual posting\. Discover how you can fully automate your Instagram content pipeline so you can focus on building your business\.\n\nReady to build your autonomous machine\? Link in bio to access the InstaFlow 2026 Pipeline: https:\/\/instaflow\.bridgebox\.ai/g, `The people winning right now aren't posting more — they've built autonomous systems that post, engage, and convert while they sleep.\n\nYou can do the same in under 24 hours.${CTA_SUFFIX}`);
      updated = true;
    }
    
    // Make sure every post ends with the Comment-to-DM CTA
    if (newNotes && !newNotes.includes("Comment 'AUTOMATE'")) {
      newNotes = newNotes.trimEnd() + CTA_SUFFIX;
      updated = true;
    }

    if (updated) {
      await prisma.contentAsset.update({
        where: { id: asset.id },
        data: { notes: newNotes }
      });
      count++;
    }
  }

  console.log(`✅ Updated ${count} posts with Comment-to-DM viral loop CTA!`);
  await prisma.$disconnect();
}

run().catch(console.error);
