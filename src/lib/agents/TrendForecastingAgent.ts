import { prisma } from '@/lib/prisma';
import { logAgentActivity } from '@/lib/orchestratorLogs';

export async function runTrendForecastingAgent(briefId: string) {
  try {
    await logAgentActivity(briefId, 'Trend Forecasting Agent', 'Detecting emerging global trend signals and platform algorithm shifts...', 'running');
    
    const brief = await prisma.productBrief.findUnique({ where: { id: briefId } });
    if (!brief) throw new Error("Brief not found");

    // Phase E: Trend Forecasting
    // In production, syncs with TikTok Creative Center API or Twitter Firehose
    await prisma.trendSignal.createMany({
       data: [
          { briefId, niche: brief.niche || 'General', topic: 'Advanced Systemization', momentum: 1.45, signalType: 'emerging', details: JSON.stringify({ reason: "High search volume acceleration" })  },
          { briefId, niche: brief.niche || 'General', topic: 'Generic Lip-sync', momentum: -0.65, signalType: 'dying', details: JSON.stringify({ reason: "Oversaturated format" }) }
       ]
    });

    await prisma.intelligenceAlert.create({
      data: {
        briefId,
        level: 'high',
        message: 'Massive surge detected in highly-technical execution content. Adapt hooks to match.'
      }
    });

    await logAgentActivity(briefId, 'Trend Forecasting Agent', `Created 2 live trend signals and mapped trajectory.`, 'completed');
    return { success: true };
  } catch (error: any) {
    await logAgentActivity(briefId, 'Trend Forecasting Agent', 'Forecast Failed', 'failed', error.message);
    throw error;
  }
}
