'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveManualTokenAction(formData: FormData) {
  const token = formData.get('token') as string;
  if (!token) return;

  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) throw new Error('No workspace found');
    
    // We overwrite or create
    const existing = await prisma.integrationToken.findFirst({
        where: { workspaceId: workspace.id, provider: 'meta_graph' }
    });
    
    if (existing) {
        await prisma.integrationToken.update({
            where: { id: existing.id },
            data: { encryptedToken: token }
        });
    } else {
        await prisma.integrationToken.create({
            data: {
              workspaceId: workspace.id,
              provider: 'meta_graph',
              encryptedToken: token
            }
        });
    }

    revalidatePath('/settings');
  } catch (error) {
    console.error('Save token failed:', error);
    throw new Error('Failed to save manual token.');
  }
}


export async function generateBriefAction(briefId: string) {
  try {
    const brief = await prisma.productBrief.findUnique({
      where: { id: briefId },
      include: { product: true }
    });

    if (!brief) throw new Error('Brief not found');

    let campaign = await prisma.campaign.findFirst({
      where: { productId: brief.productId, status: 'active' }
    });

    if (!campaign) {
      campaign = await prisma.campaign.create({
        data: {
          workspaceId: brief.product.workspaceId,
          productId: brief.productId,
          name: `${brief.product.name} Launch`,
          ctaKeywords: brief.ctaKeyword || 'LINK',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    // Synchronously "generate" an asset for demo purposes since no background worker is running
    const niche = brief.niche || brief.product.name;
    const audience = brief.targetAudience || 'your audience';
    
    const hooks = [
      "I discovered a counterintuitive truth about " + audience,
      "Stop believing the biggest lie in " + niche,
      "The exact blueprint I use to dominate " + niche
    ];
    const rawHook = hooks[Math.floor(Math.random() * hooks.length)];

    const asset = await prisma.contentAsset.create({
      data: {
        campaignId: campaign.id,
        title: `AI Generated: ${niche} Masterclass`,
        assetType: 'caption',
        status: 'scheduled',
      }
    });

    const variant = await prisma.assetVariant.create({
      data: {
        assetId: asset.id,
        variantTag: 'primary',
        hook: rawHook,
        body: `${rawHook}\n\nMost people get this completely wrong. They think the secret is grinding harder. It's actually about leveraging ${brief.product.name}.\n\nThe proof is in the results.\n\nDrop the word "${brief.ctaKeyword?.toUpperCase() || 'LINK'}" below and I'll send you my complete breakdown.\n\n#${niche.replace(/\s+/g, '').toLowerCase()}`,
      }
    });

    // Schedule for a random time in the next 14 days
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + Math.floor(Math.random() * 14) + 1);
    nextDate.setHours(9, 0, 0, 0);

    await prisma.schedule.create({
      data: { variantId: variant.id, scheduledFor: nextDate, status: 'pending' }
    });

    revalidatePath('/briefs');
    revalidatePath('/calendar');
    revalidatePath('/preview');
  } catch (error: any) {
    console.error('Error generating brief:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
}


export async function processReviewTaskAction(taskId: string, action: 'approve' | 'reject') {
  try {
    const task = await prisma.reviewTask.findUnique({ where: { id: taskId } });
    if (!task) throw new Error('Task not found');

    await prisma.reviewTask.update({
      where: { id: taskId },
      data: { 
        status: action === 'approve' ? 'approved' : 'rejected' 
      }
    });

    revalidatePath('/queue');
    revalidatePath('/overview');
  } catch (error: any) {
    console.error('Error processing review task:', error);
    throw new Error('Failed to process task.');
  }
}

export async function createBriefAction(productId: string) {
  // Placeholder for real form input, creates a dummy brief
  const product = await prisma.product.findUnique({ where: { id: productId }});
  if (!product) return;
  
  await prisma.productBrief.create({
    data: {
       productId: product.id,
       targetAudience: 'New Audience Segment',
       status: 'draft',
       approvalMode: 'semi-auto',
    }
  });
  
  revalidatePath('/briefs');
}

export async function scheduleContentAction(formData: FormData) {
  const variantId = formData.get('variantId') as string;
  const scheduledFor = formData.get('scheduledFor') as string;

  if (!variantId || !scheduledFor) throw new Error('Missing variantId or scheduledFor');

  const variant = await prisma.assetVariant.findUnique({
    where: { id: variantId },
    include: { asset: true }
  });
  if (!variant) throw new Error('Variant not found');

  await prisma.schedule.create({
    data: {
      variantId,
      scheduledFor: new Date(scheduledFor),
      status: 'pending',
    }
  });

  await prisma.contentAsset.update({
    where: { id: variant.assetId },
    data: { status: 'scheduled' }
  });

  revalidatePath('/calendar');
  revalidatePath('/overview');
  revalidatePath('/library');
}

