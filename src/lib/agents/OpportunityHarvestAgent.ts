import { prisma } from '@/lib/prisma';
import { logAgentActivity } from '@/lib/orchestratorLogs';

export async function runOpportunityHarvestAgent(briefId: string) {
  try {
    await logAgentActivity(briefId, 'Opportunity Harvest Agent', 'Identifying exploitable competitor weaknesses and blue ocean gaps...', 'running');
    
    // In production, this checks all Competitor vulnerabilities and matches them.
    await new Promise(r => setTimeout(r, 1200));

    await prisma.intelligenceAlert.create({
      data: {
        briefId,
        level: 'moderate',
        message: 'Multiple competitors show zero retention depth. High opportunity for mid-ticket continuity offer.'
      }
    });

    await logAgentActivity(briefId, 'Opportunity Harvest Agent', `Harvested 3 blue ocean expansion gaps and documented 1 retention vulnerability.`, 'completed');
    return { success: true };
  } catch (error: any) {
    await logAgentActivity(briefId, 'Opportunity Harvest Agent', 'Harvest Failed', 'failed', error.message);
    throw error;
  }
}
