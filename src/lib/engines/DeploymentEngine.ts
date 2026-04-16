import { prisma } from '@/lib/prisma';
import { monetizationEngine } from './MonetizationEngine';
import { launchBuilder } from './LaunchBuilder';
import { forecastingEngine } from './ForecastingEngine';
import { Logger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

export class DeploymentEngine {
  /**
   * THE "ONE BUTTON" Deploy Next Best Thing
   * Analyzes live system state (trends, competitors) -> determines highest value -> queues deployment.
   */
  async deployNextBestThing(workspaceId: string, options: { mode: 'preview' | 'confirm' | 'autonomous', selectedProductId?: string | null } = { mode: 'preview' }) {
    Logger.info('system', 'Initiating [Deploy Next Best Thing] Pipeline', { workspaceId, mode: options.mode, explicitTarget: options.selectedProductId });
    
    // 1. Pull Context
    const trends = await prisma.trendSignal.findMany({ where: { momentum: { gt: 1.2 } }, take: 3 });
    const competitors = await prisma.competitor.findMany({ where: { threatScore: { gt: 70 } }, take: 3 });
    const opportunities = await prisma.opportunityScore.findMany({ orderBy: { totalScore: 'desc' }, take: 1, include: { brief: true } });

    // 2. Synthesize Best Target
    let bestOpportunity = opportunities[0];
    
    // Explicit targeting override
    if (options.selectedProductId) {
       const explicitBrief = await prisma.productBrief.findFirst({
           where: { productId: options.selectedProductId },
           orderBy: { createdAt: 'desc' }
       });
       if (explicitBrief) {
           bestOpportunity = { briefId: explicitBrief.id, totalScore: 100, brief: explicitBrief } as any;
       }
    }

    if (!bestOpportunity) {
        // Fallback for fresh instances: auto-map to any existing briefing
        const fallbackBrief = await prisma.productBrief.findFirst({ where: { product: { workspaceId } }});
        if (!fallbackBrief) {
             throw new Error('No highly-ranked opportunities detected, and no Product Briefs exist to override.');
        }
        bestOpportunity = { briefId: fallbackBrief.id, totalScore: 99, brief: fallbackBrief } as any;
    }

    // 3. Map Monetization Matrix
    const monetizationPlan = await monetizationEngine.architectFramework(bestOpportunity.briefId);

    // 4. Forecast Returns
    const forecast = await forecastingEngine.predictROI(monetizationPlan, trends);

    // 5. Build Launch & Campaign Constraints
    const launchPlan = await launchBuilder.generateSequence(monetizationPlan);

    // 6. Action based on Autonomy Mode
    const deploymentId = uuidv4();

    if (options.mode === 'preview') {
       return {
          deploymentId,
          status: 'pending_review',
          target: bestOpportunity.brief.topic,
          monetization: monetizationPlan,
          forecast,
          launchPlan
       };
    }

    if (options.mode === 'confirm' || options.mode === 'autonomous') {
       // Queue the actual deployment to the agents
       await prisma.backgroundJob.create({
          data: {
             jobType: 'ORCHESTRATE_DEPLOYMENT',
             payload: JSON.stringify({
                intent: 'FULL_FUNNEL_DEPLOY',
                briefId: bestOpportunity.briefId,
                monetizationPlan,
                launchPlan,
                workspaceId
             }),
             status: 'pending'
          }
       });

       return { status: 'queued', deploymentId };
    }
  }

  /**
   * SUPERCHARGED: "Deploy Market Attack" (Top 10 x 30-Days)
   */
  async deployTop10MarketAttack(workspaceId: string) {
    Logger.info('system', 'Initiating [30-Day Full Market Domination] Pipeline', { workspaceId });
    
    // 1. Pull Top 10 Context
    let opportunities = await prisma.opportunityScore.findMany({ orderBy: { totalScore: 'desc' }, take: 10, include: { brief: true } });
    
    if (opportunities.length === 0) {
        // Fallback for fresh unranked databases
        const fallbackBriefs = await prisma.productBrief.findMany({ 
            where: { product: { workspaceId } }, 
            take: 10 
        });
        if (fallbackBriefs.length === 0) {
             throw new Error('No active products or opportunities detected to synthesize a 30-day attack.');
        }
        
        // Mock them into the array
        opportunities = fallbackBriefs.map((brief, idx) => ({
             id: 'mock-opp-' + idx,
             workspaceId,
             briefId: brief.id,
             competitorId: null,
             trendId: null,
             matchConfidence: 0.99,
             marketGapScore: 80 - (idx * 5),
             timingScore: 90 - (idx * 2),
             feasibilityScore: 70,
             profitabilityScore: 88,
             totalScore: Math.max(50, 95 - (idx * 4)),
             metadata: null,
             createdAt: new Date(),
             updatedAt: new Date(),
             brief: brief
        })) as any;
    }

    const attackMatrix = [];

    // Synthesize the 30-day strategy plan for each of the Top 10
    for (let i = 0; i < opportunities.length; i++) {
        const opp = opportunities[i];
        
        // Architect funnel context dynamically
        const monetizationPlan = await monetizationEngine.architectFramework(opp.briefId);
        
        // Generate pseudo-date timeline mapping 30 days
        const startDate = new Date();
        const dropDate = new Date(startDate);
        dropDate.setDate(startDate.getDate() + (i * 3)); // Stagger drops every 3 days

        attackMatrix.push({
             targetRank: i + 1,
             assetSignal: opp.brief.topic || 'Untitled Neural Target',
             score: opp.totalScore,
             monetization: monetizationPlan.offerType,
             projectedPrice: monetizationPlan.basePrice,
             launchSequenceLength: '30 Days',
             staggeredDropDate: dropDate.toISOString(),
             synthesisData: {
                 hooks: ['Educational Teaser', 'Vulnerability Pivot', 'Hard Pitch', 'Scarcity Drip'],
                 engagementGoal: 'Growth + Lead Capture',
                 neuralTargetingVector: (opp.brief.topic || 'TARGET').replace(/ /g, '_').toUpperCase() + '_DOMINATION'
             }
        });
    }

    // Here we would drop this massive 10x 30-Day array into the job queue.
    // For now, we return it as a "Preview" matrix so the user can visualize it.
    return {
        id: uuidv4(),
        status: 'matrix_preview_ready',
        timeline: '30-Day Staggered Cycle',
        targets: attackMatrix,
    }
  }
}

export const deploymentEngine = new DeploymentEngine();
