import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: briefId } = await params;
    const brief = await prisma.productBrief.findUnique({
      where: { id: briefId },
      include: { product: true }
    });

    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
    }

    // Determine the active campaign or create a new one for this generation
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

    // Queue a background job for the local companion to perform the LLM generation
    const job = await prisma.backgroundJob.create({
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

    return NextResponse.json({ success: true, jobId: job.id, message: 'Generation job queued for local companion.' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
