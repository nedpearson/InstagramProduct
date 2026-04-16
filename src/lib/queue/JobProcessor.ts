import { prisma } from '@/lib/prisma';
import { Logger } from '@/lib/logger';
import { masterOrchestrator } from '@/lib/agents/master/OrchestratorAgent';
import { CompetitorIntelligenceAgent } from '@/lib/agents/master/CompetitorIntelligenceAgent';
import { TrendDetectionAgent } from '@/lib/agents/master/TrendDetectionAgent';
import { ContentStrategyAgent } from '@/lib/agents/master/ContentStrategyAgent';
import { CreativeGenerationAgent } from '@/lib/agents/master/CreativeGenerationAgent';
import { MonetizationAgent } from '@/lib/agents/master/MonetizationAgent';
import { LaunchOrchestrationAgent } from '@/lib/agents/master/LaunchOrchestrationAgent';
import { PreviewSimulationAgent } from '@/lib/agents/master/PreviewSimulationAgent';
import { ContinuousLearningAgent } from '@/lib/agents/master/ContinuousLearningAgent';
import { SelfHealingAgent } from '@/lib/agents/master/SelfHealingAgent';

// Instantiate Agents
const competitorAgent = new CompetitorIntelligenceAgent();
const trendAgent = new TrendDetectionAgent();
const contentStrategyAgent = new ContentStrategyAgent();
const creativeAgent = new CreativeGenerationAgent();
const monetizationAgent = new MonetizationAgent();
const launchAgent = new LaunchOrchestrationAgent();
const previewAgent = new PreviewSimulationAgent();
const learningAgent = new ContinuousLearningAgent();
const healingAgent = new SelfHealingAgent();

export class JobProcessor {
  /** Locks next pending job, executes assigned master agent logic autonomously. */
  static async processNextBatch(batchSize: number = 5): Promise<void> {
    const jobs = await prisma.strategicJobQueue.findMany({
       where: { status: 'pending' },
       orderBy: [
           { priority: 'desc' },
           { createdAt: 'asc' }
       ],
       take: batchSize
    });

    for (const job of jobs) {
      try {
          const locked = await prisma.strategicJobQueue.update({
              where: { id: job.id, status: 'pending' },
              data: { status: 'active', lockedAt: new Date() }
          });
      } catch (e) {
          continue; // Job locked by parallel worker
      }

      try {
          const payload = job.payload ? JSON.parse(job.payload) : {};
          const contextParams = {
             briefId: job.briefId === 'SYSTEM' ? undefined : job.briefId,
             workspaceId: payload.workspaceId || 'SYSTEM'
          };

          // 🧠 Route to Master Framework
          switch (job.jobType) {
              case 'ORCHESTRATE':
                  await masterOrchestrator.run(payload, contextParams);
                  break;
              case 'COMPETITOR_INTEL':
                  await competitorAgent.run(payload, contextParams);
                  break;
              case 'TREND_DETECTION':
                  await trendAgent.run(payload, contextParams);
                  break;
              case 'CONTENT_STRATEGY':
                  await contentStrategyAgent.run(payload, contextParams);
                  break;
              case 'CREATIVE_GENERATOR':
                  await creativeAgent.run(payload, contextParams);
                  break;
              case 'MONETIZATION_OPT':
                  await monetizationAgent.run(payload, contextParams);
                  break;
              case 'LAUNCH_PLANNER':
                  await launchAgent.run(payload, contextParams);
                  break;
              case 'PREDICTIVE_SIMULATION':
                  await previewAgent.run(payload, contextParams);
                  break;
              case 'CONTINUOUS_LEARNING':
                  await learningAgent.run(payload, contextParams);
                  break;
              case 'SELF_HEALING':
                  await healingAgent.run(payload, contextParams);
                  break;
              default:
                  if(job.jobType.startsWith('SUBAGENT_')) {
                     // Dynamic subagent execution logic placeholder
                      Logger.info('queue', `Executing Subagent: ${job.jobType}`, payload);
                  } else {
                      Logger.warn('queue', `Unmapped core job type: ${job.jobType}`);
                  }
          }

          await prisma.strategicJobQueue.update({
              where: { id: job.id },
              data: { status: 'completed' }
          });

      } catch (err: any) {
          Logger.error('queue', 'Job execution halted', { error: err.message, jobId: job.id });
          await prisma.strategicJobQueue.update({
              where: { id: job.id },
              data: { 
                 status: job.retries >= 2 ? 'failed' : 'pending',
                 retries: { increment: 1 },
                 errorMessage: err.message
              }
          });
      }
    }
  }
}
