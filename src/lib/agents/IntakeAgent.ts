import { prisma } from '@/lib/prisma';
import { logAgentActivity } from '@/lib/orchestratorLogs';

export async function runBriefIntakeAgent(briefId: string) {
  try {
    await logAgentActivity(briefId, 'Brief Intake Agent', 'Parsing user inputs & building context schema...', 'running');
    
    const brief = await prisma.productBrief.findUnique({ where: { id: briefId }, include: { product: true } });
    if (!brief) throw new Error("Brief not found");

    // Phase B: Simulate advanced intake mapping
    const nicheTarget = brief.niche || brief.product?.name || 'General Market';
    
    // In production, this would call LLM to parse targetAudience, monetization models, etc.
    const inferredAudience = "High-Income Operators";
    const inferredMonetization = "High-Ticket VSL";

    await prisma.productBrief.update({
      where: { id: briefId },
      data: {
        targetAudience: brief.targetAudience ?? inferredAudience,
      }
    });

    await logAgentActivity(briefId, 'Brief Intake Agent', `Intake Complete. Normalized Niche: ${nicheTarget} | Audience: ${inferredAudience}`, 'completed');
    return { success: true, nicheTarget };
  } catch (error: any) {
    await logAgentActivity(briefId, 'Brief Intake Agent', 'Intake Failed', 'failed', error.message);
    throw error;
  }
}
