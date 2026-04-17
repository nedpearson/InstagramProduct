import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * Competitive Intelligence Agent & Signal Scoring Engine
 * Harvests patterns from competitors (hooks, formats, offers) and scores them
 * based on engagement velocity and longevity to identify market gaps.
 */
export async function POST(request: Request) {
  headers();
  try {
    const brief = await prisma.productBrief.findFirst();
    if (!brief) return NextResponse.json({ error: 'No brief configured' }, { status: 404 });

    const activity = await prisma.agentActivity.create({
      data: {
        briefId: brief.id,
        agentName: 'Competitive Intelligence Agent',
        status: 'running',
        task: 'Extracting competitor patterns and scoring engagement signals',
      }
    });

    const competitors = await prisma.competitor.findMany({
      where: { isTrackingLive: true },
    });

    if (competitors.length === 0) {
      throw new Error('No active competitors tracked to analyze');
    }

    // Phase 1: Data Extraction & Normalization
    // Mocking the ingestion of Meta Ad Library and IG reels data
    const extractedPatterns = [
      { type: 'hook', format: 'contrarian_statement', source: competitors[0]?.brandName || 'Market', velocity: 9.4, longevity: 120 },
      { type: 'offer', format: 'low_ticket_tripwire_plus_coaching', source: competitors[1]?.brandName || 'Market', velocity: 8.7, longevity: 200 },
      { type: 'funnel', format: 'vsl_to_application', source: competitors[0]?.brandName || 'Market', velocity: 6.2, longevity: 400 },
    ];

    // Phase 2: Signal Scoring Engine
    // Scores = engagement velocity * longevity factor -> penalizing one-off viral sounds
    const scoredPatterns = extractedPatterns.map(p => ({
      ...p,
      signalScore: (p.velocity * 10) * (p.longevity > 30 ? 1.5 : 0.5),
      status: p.velocity > 8 ? 'Winning' : 'Saturated',
    }));

    const winningPatterns = scoredPatterns.filter(p => p.status === 'Winning');

    await prisma.agentActivity.update({
      where: { id: activity.id },
      data: {
        status: 'completed',
        result: JSON.stringify({ extracted: extractedPatterns.length, winners: winningPatterns.length, winningPatterns }),
        durationMs: 1650,
      }
    });

    return NextResponse.json({
      success: true,
      extractedPatterns: extractedPatterns.length,
      scoredPatterns,
      winningPatterns,
      nextAction: 'Pass winning patterns to Differentiation Engine',
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
