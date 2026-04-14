'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function generateBriefAction(briefId: string) {
  try {
    const brief = await prisma.productBrief.findUnique({
      where: { id: briefId },
      include: { product: true }
    });

    if (!brief) {
      throw new Error('Brief not found');
    }

    let campaign = await prisma.campaign.findFirst({
      where: { productId: brief.productId, status: 'active' }
    });

    if (!campaign) {
      campaign = await prisma.campaign.create({
        data: {
          workspaceId: brief.product.workspaceId,
          productId: brief.productId,
          name: `Auto-Campaign for ${brief.product.name}`,
          ctaKeywords: brief.ctaKeyword || 'LINK',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + (brief.campaignDurationDays || 30) * 24 * 60 * 60 * 1000)
        }
      });
    }

    await prisma.backgroundJob.create({
      data: {
        jobType: 'generate_content',
        payload: JSON.stringify({
          briefId: brief.id,
          campaignId: campaign.id,
          niche: brief.niche,
          tone: brief.toneOfVoice,
          productType: brief.productType
        }),
        status: 'queued'
      }
    });

    revalidatePath('/briefs');
    revalidatePath('/overview');
  } catch (error: any) {
    console.error('Error generating brief:', error);
    throw new Error('Failed to start generation job. Please try again.');
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
