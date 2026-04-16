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
  async deployNextBestThing(workspaceId: string, options: { mode: 'preview' | 'confirm' | 'autonomous' } = { mode: 'preview' }) {
    Logger.info('system', 'Initiating [Deploy Next Best Thing] Pipeline', { workspaceId, mode: options.mode });
    
    // 1. Pull Context
    const trends = await prisma.trendSignal.findMany({ where: { momentum: { gt: 1.2 } }, take: 3 });
    const competitors = await prisma.competitor.findMany({ where: { threatScore: { gt: 70 } }, take: 3 });
    const opportunities = await prisma.opportunityScore.findMany({ orderBy: { totalScore: 'desc' }, take: 1, include: { brief: true } });

    // 2. Synthesize Best Target
    const bestOpportunity = opportunities[0];
    if (!bestOpportunity) {
        throw new Error('No highly-ranked opportunities detected in the matrix.');
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
       await prisma.strategicJobQueue.create({
          data: {
             jobType: 'ORCHESTRATE',
             briefId: bestOpportunity.briefId,
             payload: JSON.stringify({
                intent: 'FULL_FUNNEL_DEPLOY',
                monetizationPlan,
                launchPlan,
                workspaceId
             }),
             priority: 100,
             status: 'pending'
          }
       });

       return { status: 'queued', deploymentId };
    }
  }
}

export const deploymentEngine = new DeploymentEngine();
