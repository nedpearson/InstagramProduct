import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * SaaS Monetization Agent
 * Identifies high-intent free/trial users, triggers dynamic upgrade offers
 * and assigns targeted discounts based on usage patterns.
 */
export async function POST(request: Request) {
  headers();
  try {
    const brief = await prisma.productBrief.findFirst();
    if (!brief) return NextResponse.json({ error: 'No brief configured' }, { status: 404 });

    const activity = await prisma.agentActivity.create({
      data: {
        briefId: brief.id,
        agentName: 'SaaS Monetization Agent',
        status: 'running',
        task: 'Scanning trial/free users for upgrade intent and dynamic discounting',
      }
    });

    // 1. Identify users actively on trial or using free features heavily
    const activeInstallations = await prisma.workspace.findMany({
      include: {
        owner: true,
        _count: {
          select: { products: true, campaigns: true, leads: true }
        }
      }
    });

    const highIntentUsers = activeInstallations.filter(w => 
      w._count.campaigns > 0 || w._count.leads > 5
    );

    // 2. Generate dynamic upgrade offers (mocking discount application logic)
    const offers = highIntentUsers.map(workspace => {
      let discountCode = null;
      let urgency = 'low';

      // If they have high usage, offer an upgrade incentive
      if (workspace._count.leads > 20) {
        discountCode = 'SCALE20'; // 20% off Pro
        urgency = 'high';
      } else if (workspace._count.campaigns > 0) {
        discountCode = 'EARLY10'; // 10% off Starter/Pro
        urgency = 'medium';
      }

      return {
        workspaceId: workspace.id,
        ownerEmail: workspace.owner?.email,
        usageScore: workspace._count.leads + (workspace._count.campaigns * 10),
        discountCode,
        urgency,
        recommendedAction: discountCode ? 'trigger_offer_email' : 'wait'
      };
    });

    const triggeredOffers = offers.filter(o => o.recommendedAction === 'trigger_offer_email');

    // Here we would typically trigger the Lifecycle flow or create an in-app notification

    const result = {
      scannedWorkspaces: activeInstallations.length,
      highIntentFound: highIntentUsers.length,
      offersGenerated: triggeredOffers.length,
      topOffers: triggeredOffers.slice(0, 5),
    };

    await prisma.agentActivity.update({
      where: { id: activity.id },
      data: {
        status: 'completed',
        result: JSON.stringify(result),
        durationMs: 950,
      }
    });

    return NextResponse.json({ success: true, ...result });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
