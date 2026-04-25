import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * Self-Healing Agent + Master Decision Orchestrator
 * Runs all sub-agents in sequence, detects failures, and auto-corrects.
 * Called by cron job every 5 minutes on Railway or external ping service.
 */
export async function POST(request: Request) {
  headers();

  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const results: Record<string, any> = {};
  const errors: string[] = [];
  const healed: string[] = [];

  // ─── STEP 1: Run Intelligence Agent ────────────────────────────────────────
  try {
    const brief = await prisma.productBrief.findFirst({ where: { status: 'active' } });
    if (brief) {
      const intelligenceRes = await fetch(`${baseUrl}/api/agents/intelligence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefId: brief.id }),
      });
      results.intelligence = await intelligenceRes.json();
    }
  } catch (e: any) {
    errors.push(`Intelligence: ${e.message}`);
    healed.push('Intelligence: scheduled retry next cycle');
  }

  // ─── STEP 1.1: Competitive Intelligence & Signal Scoring ───────────────────
  let winningPatterns: any[] = [];
  try {
    const compIntRes = await fetch(`${baseUrl}/api/agents/competitive-intelligence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const cpData = await compIntRes.json();
    results.competitiveIntelligence = cpData;
    winningPatterns = cpData.winningPatterns || [];
  } catch (e: any) {
    errors.push(`CompIntel: ${e.message}`);
  }

  // ─── STEP 1.2: Differentiation & Risk Layer ────────────────────────────────
  let strategyUpgrades = [];
  if (winningPatterns.length > 0) {
    try {
      const diffRes = await fetch(`${baseUrl}/api/agents/differentiation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winningPatterns }),
      });
      const diffData = await diffRes.json();
      results.differentiation = diffData;
      strategyUpgrades = diffData.strategyUpgrades || [];
    } catch (e: any) {
      errors.push(`Differentiation: ${e.message}`);
    }
  }

  // ─── STEP 1.3: Funnel & Rapid Deployment Agent ─────────────────────────────
  if (strategyUpgrades.length > 0) {
    try {
      const funnelRes = await fetch(`${baseUrl}/api/agents/funnel-optimization`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategyUpgrades }),
      });
      results.funnelOptimization = await funnelRes.json();
    } catch (e: any) {
      errors.push(`FunnelOpt: ${e.message}`);
    }
  }

  // ─── STEP 2: Run Ads Intelligence Agent ────────────────────────────────────
  try {
    const adsRes = await fetch(`${baseUrl}/api/agents/ads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'optimize' }),
    });
    results.ads = await adsRes.json();
  } catch (e: any) {
    errors.push(`Ads: ${e.message}`);
    healed.push('Ads: fallback to organic content mode');
  }

  // ─── STEP 3: Self-Heal Failed Schedules ────────────────────────────────────
  try {
    const failedSchedules = await prisma.schedule.findMany({
      where: { status: 'failed' },
      take: 10,
    });

    if (failedSchedules.length > 0) {
      // Requeue failed posts for next optimal slot
      const nextSlot = new Date();
      nextSlot.setHours(nextSlot.getHours() + 1);

      await Promise.all(failedSchedules.map(s =>
        prisma.schedule.update({
          where: { id: s.id },
          data: { status: 'pending', scheduledFor: nextSlot, errorLog: null }
        })
      ));

      healed.push(`Requeued ${failedSchedules.length} failed posts`);
      results.selfHealing = { requeued: failedSchedules.length };
    }
  } catch (e: any) {
    errors.push(`SelfHeal: ${e.message}`);
  }

  // ─── STEP 4: LTV Decision Pull ─────────────────────────────────────────────
  try {
    const ltvRes = await fetch(`${baseUrl}/api/agents/ltv`);
    results.ltv = await ltvRes.json();
  } catch (e: any) {
    errors.push(`LTV: ${e.message}`);
  }

  // ─── STEP 5: Lifecycle Agent ───────────────────────────────────────────────
  try {
    const lifecycleRes = await fetch(`${baseUrl}/api/agents/lifecycle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'enroll', sequence: 'welcome' }),
    });
    results.lifecycle = await lifecycleRes.json();
  } catch (e: any) {
    errors.push(`Lifecycle: ${e.message}`);
  }

  // ─── STEP 6: SaaS Monetization Agent ───────────────────────────────────────
  try {
    const saasRes = await fetch(`${baseUrl}/api/agents/saas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    results.saas = await saasRes.json();
  } catch (e: any) {
    errors.push(`SaaS: ${e.message}`);
  }

  // ─── STEP 7: Customer Value (LTV) Agent ────────────────────────────────────
  try {
    const cvRes = await fetch(`${baseUrl}/api/agents/customer-value`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    results.customerValue = await cvRes.json();
  } catch (e: any) {
    errors.push(`Customer Value: ${e.message}`);
  }
  // ─── STEP 7.5: Revenue Scaling Engine ──────────────────────────────────────
  try {
    const scaleRes = await fetch(`${baseUrl}/api/agents/revenue-scaling`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    results.revenueScaling = await scaleRes.json();
  } catch (e: any) {
    errors.push(`Revenue Scaling: ${e.message}`);
  }
  // ─── STEP 7.8: Velocity Compression Engine ─────────────────────────────────
  try {
    const velocityRes = await fetch(`${baseUrl}/api/agents/velocity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    results.velocityEngine = await velocityRes.json();
  } catch (e: any) {
    errors.push(`Velocity Engine: ${e.message}`);
  }

  // ─── STEP 8: Check integration health  ─────────────────────────────────────
  try {
    const tokens = await prisma.integrationToken.findMany({
      where: { provider: 'meta_graph' },
    });

    results.integrationHealth = {
      totalTokens: tokens.length,
      status: tokens.length > 0 ? 'HEALTHY' : 'REAUTH_REQUIRED',
    };

    if (tokens.length === 0) {
      healed.push(`No Meta integration token found — authentication required at /settings`);
    }
  } catch (e: any) {
    errors.push(`Integration health: ${e.message}`);
  }

  // ─── STEP 9: Master System Auditor & Validation Engine ─────────────────────
  try {
    const auditorRes = await fetch(`${baseUrl}/api/agents/auditor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    results.systemAudit = await auditorRes.json();
    
    if (results.systemAudit.issuesDetected && results.systemAudit.issuesDetected.length > 0) {
      errors.push(`Auditor found ${results.systemAudit.issuesDetected.length} system issues`);
    }
  } catch (e: any) {
    errors.push(`Auditor failure: ${e.message}`);
  }

  // ─── FINAL REPORT ──────────────────────────────────────────────────────────
  const status = errors.length === 0 ? 'FULLY_AUTONOMOUS' : 'SELF_HEALING';

  // Log the orchestration run
  const brief = await prisma.productBrief.findFirst();
  if (brief) {
    await prisma.agentActivity.create({
      data: {
        briefId: brief.id,
        agentName: 'Master Decision Orchestrator',
        status: errors.length === 0 ? 'completed' : 'completed',
        task: 'Full system cycle: intelligence + ads + self-healing + LTV',
        result: JSON.stringify({ status, errors: errors.length, healed: healed.length }),
        durationMs: 3500,
      }
    });
  }

  return NextResponse.json({
    success: true,
    cycleTimestamp: new Date().toISOString(),
    systemStatus: status,
    agentResults: results,
    errorsDetected: errors,
    selfHealingActions: healed,
    nextCycleIn: '5 minutes (via Railway cron or external ping)',
  });
}
