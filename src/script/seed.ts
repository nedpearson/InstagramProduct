/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo dataset...');

  // Create workspace and user
  const user = await prisma.user.create({
    data: {
      email: 'founder@example.com',
      name: 'Founder Demo',
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: 'Default Workspace',
      owner: { connect: { id: user.id } },
    },
  });

  // Settings
  await prisma.settings.create({
    data: {
      workspaceId: workspace.id,
      automationMode: 'semi-auto',
    },
  });

  // Accounts
  const igAccount = await prisma.instagramAccount.create({
    data: {
      workspaceId: workspace.id,
      igAccountId: '1234567890',
      username: '@demo_creator',
      isActive: true,
    },
  });

  // Product
  const product = await prisma.product.create({
    data: {
      workspaceId: workspace.id,
      name: 'Instagram Growth Masterclass',
      description: 'A 4-week cohort-based course teaching Instagram automation and content strategy.',
      price: 297,
    },
  });

  // Product Brief
  await prisma.productBrief.create({
    data: {
      productId: product.id,
      niche: 'Digital Marketing / Content Creators',
      topic: 'Instagram Automation & Growth',
      targetAudience: 'Coaches, consultants, and course creators stuck under 10k followers.',
      biggestPainPoint: 'Spending 3+ hours a day on content and getting zero inbound leads.',
      desiredTransformation: 'Automate content and get 5-10 qualified leads per day on autopilot.',
      productType: 'Course',
      leadMagnet: 'Free Automate-Your-IG Checklist',
      ctaKeyword: 'SYSTEM',
      founderStory: 'I used to burn out writing captions manually until I built this automated system.',
      toneOfVoice: 'Authoritative, Warm, Direct',
      status: 'active',
    },
  });

  // Campaign
  const campaign = await prisma.campaign.create({
    data: {
      workspaceId: workspace.id,
      productId: product.id,
      name: 'Q3 Launch - Growth Masterclass',
      ctaKeywords: 'SYSTEM,GROW,AUTO',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  // Create Assets
  // 10 Captions
  for (let i = 1; i <= 10; i++) {
    await prisma.contentAsset.create({
      data: {
        campaignId: campaign.id,
        title: `Core Caption Topic ${i}`,
        assetType: 'caption',
        status: 'approved',
        variants: {
          create: [
            { variantTag: 'warm', hook: `Stop doing X ${i}`, body: 'Instead do Y...', cta: 'Comment SYSTEM for the checklist.' },
            { variantTag: 'direct', hook: `The real reason you fail at X ${i}`, body: 'Is because of Y...', cta: 'Comment SYSTEM.' },
          ],
        },
      },
    });
  }

  // 5 Reel Scripts
  for (let i = 1; i <= 5; i++) {
    await prisma.contentAsset.create({
      data: {
        campaignId: campaign.id,
        title: `Reel Script ${i}`,
        assetType: 'reel',
        status: 'approved',
        variants: {
          create: [
            { variantTag: 'evergreen', hook: `Want to fix ${i}?`, body: 'Step 1, Step 2...', cta: 'DM me.' },
          ],
        },
      },
    });
  }

  // 5 Carousel Drafts
  for (let i = 1; i <= 5; i++) {
    await prisma.contentAsset.create({
      data: {
        campaignId: campaign.id,
        title: `Carousel Setup ${i}`,
        assetType: 'carousel',
        status: 'draft',
        variants: {
          create: [{ variantTag: 'advanced', body: 'Slide 1, Slide 2...' }],
        },
      },
    });
  }

  // 3 DM Sequences
  for (let i = 1; i <= 3; i++) {
    await prisma.contentAsset.create({
      data: {
        campaignId: campaign.id,
        title: `DM Sequence ${i}`,
        assetType: 'dm_sequence',
        status: 'approved',
        variants: {
          create: [
            { body: `Message 1: Hey! Here is the link. Message 2: Checking in. Message 3: Any questions?` }
          ]
        }
      }
    });
  }

  // 5 Bio options
  await prisma.contentAsset.create({
    data: {
      campaignId: campaign.id,
      title: `Bio Ideas`,
      assetType: 'bio',
      status: 'approved',
      variants: {
        create: [
          { body: 'Helping creators automate IG. 🚀\nDM "SYSTEM" to scale.\n👇 Free Training' },
          { body: 'I build content engines. ⚙️\nWant 10 inbound leads/day?\n👇 Get the checklist' },
        ],
      },
    },
  });

  // Leads & Comments Demo
  const post = await prisma.publishedPost.create({
    data: {
      variantId: (await prisma.assetVariant.findFirst())?.id || 'unknown',
      igPostId: 'POST_001',
      publishedAt: new Date(),
    },
  });

  await prisma.comment.create({
    data: {
      postId: post.id,
      username: 'target_client_1',
      text: 'I definitely need a SYSTEM!',
      isLead: true,
    },
  });

  const lead = await prisma.lead.create({
    data: {
      campaignId: campaign.id,
      postId: post.id,
      igUsername: 'target_client_1',
      source: 'comment',
      keywordMatched: 'SYSTEM',
      status: 'responded',
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
