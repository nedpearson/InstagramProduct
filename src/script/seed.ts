import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 InstaFlow Autonomous Seed Starting...');

  // 1. Ensure Workspace exists
  let user = await prisma.user.findFirst({ where: { email: 'admin@instaflow.ai' } });
  if (!user) {
    user = await prisma.user.create({
      data: { email: 'admin@instaflow.ai', name: 'Ned Pearson', systemRole: 'admin' }
    });
  }

  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: { name: 'InstaFlow Production', ownerId: user.id }
    });
  }

  console.log('✅ Workspace:', workspace.id);

  // 2. Seed Product
  let product = await prisma.product.findFirst({ where: { workspaceId: workspace.id } });
  if (!product) {
    product = await prisma.product.create({
      data: {
        workspaceId: workspace.id,
        name: 'InstaFlow Growth System',
        description: 'Autonomous Instagram growth and monetization platform',
        price: 997,
        isActive: true,
      }
    });
  }

  console.log('✅ Product:', product.id);

  // 3. Seed Brief
  let brief = await prisma.productBrief.findFirst({ where: { productId: product.id } });
  if (!brief) {
    brief = await prisma.productBrief.create({
      data: {
        productId: product.id,
        niche: 'Instagram Growth & Monetization',
        topic: 'Autonomous social media business systems',
        targetAudience: 'Entrepreneurs, coaches, and digital product creators',
        biggestPainPoint: 'Spending hours on content with no consistent results or revenue',
        desiredTransformation: 'A fully automated Instagram system that grows and monetizes on autopilot',
        productType: 'SaaS + Coaching Hybrid',
        ctaKeyword: 'FLOW',
        toneOfVoice: 'Confident, authoritative, results-driven, no fluff',
        postingFrequency: '2x daily',
        campaignDurationDays: 30,
        approvalMode: 'full-auto',
        brandVoiceNotes: 'We speak in outcomes, not features. We lead with bold claims backed by proof.',
        visualStyleNotes: 'Dark mode, indigo/violet/emerald gradient theme. High contrast. Bold typography.',
        hashtagStyle: '#instaflow #growyourinsta #passiveincome #contentcreator #digitalmarketing',
        status: 'active',
      }
    });
  }

  console.log('✅ Brief:', brief.id);

  // 4. Seed Campaign
  let campaign = await prisma.campaign.findFirst({ where: { productId: product.id } });
  if (!campaign) {
    campaign = await prisma.campaign.create({
      data: {
        workspaceId: workspace.id,
        productId: product.id,
        name: 'InstaFlow Launch Attack - 30 Day Blitz',
        ctaKeywords: 'FLOW,APPLY,BLUEPRINT',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    });
  }

  console.log('✅ Campaign:', campaign.id);

  // 5. Seed 30 Content Assets (the full autonomous pipeline)
  const hooks = [
    'The Instagram algorithm is broken — unless you know this.',
    'I went from 0 to 10k followers in 30 days. Here\'s exactly how.',
    'Stop posting content. Start posting systems.',
    'Every big creator uses this. Every broke creator ignores it.',
    'Your Instagram isn\'t growing because of THIS mistake.',
    'I automated my entire Instagram and made $12k in a month.',
    'The #1 reason your content gets 0 engagement.',
    'This hook formula works 94% of the time.',
    'Comment FLOW and I\'ll send you the exact blueprint I use.',
    'You don\'t need more followers. You need a better system.',
    'The posting time myth that\'s costing you reach.',
    'I fired my social media manager and automated everything.',
    'Why going viral doesn\'t mean going profitable.',
    'The 3-second rule that triples your Reels completion rate.',
    'Most creators quit because they never learn this one thing.',
    'Here\'s the DM funnel that converts 1 in 3 followers.',
    'Your bio is losing you 20% of potential followers.',
    'The algorithm rewards this specific behavior every time.',
    'I analyzed 500 viral posts. Here\'s what they all have in common.',
    'Low followers, high income — the counterintuitive strategy.',
    'This content calendar template runs itself.',
    'Why consistency doesn\'t matter as much as you think.',
    'The comment that converts strangers into paying customers.',
    'Stop using hashtags like it\'s 2018.',
    'How I schedule 30 days of content in one afternoon.',
    'The one slide in a carousel that makes people save it forever.',
    'Your product isn\'t the problem. Your positioning is.',
    'I tested 47 hooks. Only 3 actually worked.',
    'The Instagram bio formula that makes people follow instantly.',
    'Most creators burn out. Here\'s how to build a machine instead.',
  ];

  const captions = hooks.map((hook, i) => ({
    campaignId: campaign.id,
    title: `Asset ${i + 1}: ${hook.substring(0, 50)}`,
    assetType: i % 3 === 0 ? 'reel' : i % 3 === 1 ? 'carousel' : 'caption',
    status: 'approved',
    variants: {
      create: [{
        hook,
        body: `Here is the breakdown no one talks about.\n\nMost people approach Instagram completely backwards.\n\nThey create content hoping it will go viral.\nThey post randomly and pray for engagement.\nThey follow trends without a strategy.\n\nThe top 1% do this instead:\n→ They build systems before they build content.\n→ They optimize for conversion, not just views.\n→ They let automation do the heavy lifting.\n\nThis is exactly what InstaFlow does for you.`,
        cta: 'Comment FLOW below and I\'ll send you the blueprint.',
        keyword: 'FLOW',
        publishReadinessScore: 0.95,
        automationConfidence: 0.99,
        contentQualityScore: 0.92,
        brandFitScore: 0.98,
      }]
    }
  }));

  let assetsCreated = 0;
  for (const assetData of captions) {
    const exists = await prisma.contentAsset.findFirst({
      where: { campaignId: campaign.id, title: assetData.title }
    });
    if (!exists) {
      await prisma.contentAsset.create({ data: assetData });
      assetsCreated++;
    }
  }

  console.log(`✅ Content Assets Seeded: ${assetsCreated} new assets`);

  // 6. Seed Competitors for War Room
  const competitorData = [
    { brandName: 'Later', threatScore: 72, positioning: 'Scheduling tool with limited AI' },
    { brandName: 'Hootsuite', threatScore: 65, positioning: 'Enterprise focus, high price point' },
    { brandName: 'Buffer', threatScore: 58, positioning: 'Simplified posting, no growth intelligence' },
    { brandName: 'SocialBee', threatScore: 61, positioning: 'Basic categorized scheduling' },
  ];

  for (const comp of competitorData) {
    const exists = await prisma.competitor.findFirst({ where: { briefId: brief.id, brandName: comp.brandName } });
    if (!exists) {
      await prisma.competitor.create({ data: { briefId: brief.id, ...comp, isTrackingLive: true } });
    }
  }

  console.log('✅ Competitors seeded');

  // 7. Seed Opportunity Score
  await prisma.opportunityScore.upsert({
    where: { briefId: brief.id },
    create: {
      briefId: brief.id,
      totalScore: 90.75,
      components: {
        create: [
          { componentName: 'Audience Demand', value: 96, reasoning: 'High search volume and engagement in niche' },
          { componentName: 'Competition Vulnerability', value: 81, reasoning: 'Competitors lack AI automation layer' },
          { componentName: 'Speed to Market', value: 92, reasoning: 'Platform infrastructure already live' },
          { componentName: 'Profit Margin', value: 94, reasoning: 'SaaS model with low COGS' },
        ]
      }
    },
    update: { totalScore: 90.75 }
  });

  console.log('✅ Opportunity Score set: 90.75');

  // 8. Schedule content (first 14 posts scheduled across next 14 days)
  const variants = await prisma.assetVariant.findMany({
    where: { asset: { campaignId: campaign.id } },
    take: 14,
    include: { asset: true }
  });

  let schedulesCreated = 0;
  for (let i = 0; i < variants.length; i++) {
    const exists = await prisma.schedule.findFirst({ where: { variantId: variants[i].id } });
    if (!exists) {
      const scheduledFor = new Date();
      scheduledFor.setDate(scheduledFor.getDate() + i);
      scheduledFor.setHours(9, 0, 0, 0); // 9 AM daily
      await prisma.schedule.create({
        data: { variantId: variants[i].id, scheduledFor, status: 'pending' }
      });
      schedulesCreated++;
    }
  }

  console.log(`✅ Schedules created: ${schedulesCreated}`);

  console.log('\n🎯 SYSTEM FULLY SEEDED. InstaFlow is operational.');
  console.log('📊 Campaign:', campaign.name);
  console.log('🔗 Live at: https://instaflow.bridgebox.ai/products/bridgebox');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
