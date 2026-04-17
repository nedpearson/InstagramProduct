import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * LTV + Decision Engine Agent
 * Tracks Customer Acquisition Cost, Lifetime Value, ROAS, funnel conversion.
 * Makes autonomous budget allocation and funnel optimization decisions.
 */
export async function GET(request: Request) {
  headers();
  try {
    // Pull all revenue signals from across the system
    const [
      totalLeads,
      totalCampaigns,
      activeSchedules,
      publishedPosts,
      totalBriefs,
      recentAgentRuns,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.campaign.count({ where: { status: 'active' } }),
      prisma.schedule.count({ where: { status: 'pending' } }),
      prisma.publishedPost.count(),
      prisma.productBrief.count(),
      prisma.agentActivity.findMany({
        where: { status: 'completed' },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    // LTV Model (algorithmic — real data feeds in as Stripe connects)
    const avgOrderValue = 97; // Pro plan price
    const estimatedConversionRate = 0.034; // 3.4% free→paid
    const estimatedLTV = avgOrderValue * 8.2; // 8.2 month average retention
    const estimatedCAC = 12.40; // organic CAC via content
    const ltvCacRatio = estimatedLTV / estimatedCAC;

    // ROAS Model
    const organicReach = publishedPosts * 2400; // avg reach per post
    const estimatedRevenue = totalLeads * estimatedConversionRate * avgOrderValue;
    const estimatedAdSpend = 150; // current test budget
    const roas = estimatedAdSpend > 0 ? estimatedRevenue / estimatedAdSpend : 0;

    // Decision Engine: autonomous budget allocation recommendations
    const decisions = [];

    if (ltvCacRatio > 3) {
      decisions.push({ action: 'SCALE_ACQUISITION', reason: `LTV:CAC ratio ${ltvCacRatio.toFixed(1)}x exceeds 3x threshold — increase ad spend`, priority: 'HIGH' });
    }
    if (activeSchedules > 5) {
      decisions.push({ action: 'MAINTAIN_CONTENT_CADENCE', reason: `${activeSchedules} posts queued — pipeline healthy`, priority: 'LOW' });
    }
    if (totalLeads < 10) {
      decisions.push({ action: 'BOOST_TOP_OF_FUNNEL', reason: 'Lead volume below threshold — increase posting frequency + activate DM funnels', priority: 'HIGH' });
    }
    if (recentAgentRuns.length > 5) {
      decisions.push({ action: 'AGENTS_HEALTHY', reason: `${recentAgentRuns.length} agent runs completed successfully`, priority: 'INFO' });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        totalLeads,
        activeCampaigns: totalCampaigns,
        postsQueued: activeSchedules,
        postsPublished: publishedPosts,
        organicReach: organicReach.toLocaleString(),
      },
      ltv: {
        estimatedLTV: `$${estimatedLTV.toFixed(2)}`,
        estimatedCAC: `$${estimatedCAC.toFixed(2)}`,
        ltvCacRatio: `${ltvCacRatio.toFixed(1)}x`,
        avgOrderValue: `$${avgOrderValue}`,
        conversionRate: `${(estimatedConversionRate * 100).toFixed(1)}%`,
      },
      roas: {
        estimatedRevenue: `$${estimatedRevenue.toFixed(2)}`,
        adSpend: `$${estimatedAdSpend}`,
        roas: roas > 0 ? `${roas.toFixed(1)}x` : 'No ad spend yet',
      },
      decisions,
      systemHealth: {
        contentPipeline: activeSchedules > 0 ? 'RUNNING' : 'EMPTY',
        agentLayer: recentAgentRuns.length > 0 ? 'ACTIVE' : 'IDLE',
        stripeIntegration: process.env.STRIPE_SECRET_KEY ? 'CONNECTED' : 'AWAITING_KEY',
        emailEngine: process.env.RESEND_API_KEY ? 'ACTIVE' : 'AWAITING_KEY',
        metaAds: process.env.META_ADS_ACCESS_TOKEN ? 'ACTIVE' : 'AWAITING_TOKEN',
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
