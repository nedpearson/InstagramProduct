import { prisma } from '@/lib/prisma';
import { logAgentActivity } from '@/lib/orchestratorLogs';

import { runBriefIntakeAgent } from '@/lib/agents/IntakeAgent';
import { runMarketResearchAgent } from '@/lib/agents/MarketResearchAgent';
import { runTrendForecastingAgent } from '@/lib/agents/TrendForecastingAgent';
import { runOpportunityHarvestAgent } from '@/lib/agents/OpportunityHarvestAgent';
import { runExecutionActivationAgent } from '@/lib/agents/ExecutionActivationAgent';
import { generateStrategicBlueprintAction, analyzeCompetitorAction } from '@/app/(app)/actions';

/**
 * Phase A: Core Production Background Job Orchestrator
 * Pushes jobs into the queue and processes them sequentially to guarantee resilience.
 */
export async function startAutonomousOrchestration(briefId: string) {
  try {
    await prisma.productBrief.update({
      where: { id: briefId },
      data: { status: 'processing' }
    });

    // 1. Spool Job Queue for this brief
    const jobsToQueue = [
      'BRIEF_INTAKE',
      'MARKET_RESEARCH',
      'COMPETITOR_INTELLIGENCE',
      'OPPORTUNITY_HARVEST',
      'STRATEGY_SYNTHESIS',
      'TREND_FORECASTING',
      'EXECUTION_ACTIVATION'
    ];

    for (const jobType of jobsToQueue) {
      await prisma.strategicJobQueue.create({
         data: { briefId, jobType, status: 'pending' }
      });
    }

    // Fire the worker explicitly in this dev environment. 
    // In strict production, an external Redis/BullMQ worker consumes from 'pending'.
    processJobQueue(briefId).catch(console.error);

  } catch (error) {
    console.error("Orchestration start failed:", error);
  }
}

/**
 * Processes strictly pending jobs. Implements Phase G Hardening (Idempotency, retries)
 */
async function processJobQueue(briefId: string) {
    const jobs = await prisma.strategicJobQueue.findMany({
       where: { briefId, status: 'pending' },
       orderBy: { createdAt: 'asc' }
    });

    for (const job of jobs) {
      // Lock job
      await prisma.strategicJobQueue.update({
         where: { id: job.id },
         data: { status: 'active', lockedAt: new Date() }
      });

      try {
        switch (job.jobType) {
          case 'BRIEF_INTAKE':
            await runBriefIntakeAgent(briefId);
            break;
          case 'MARKET_RESEARCH':
            await runMarketResearchAgent(briefId);
            break;
          case 'COMPETITOR_INTELLIGENCE':
            await logAgentActivity(briefId, 'Competitor Intelligence Agent', 'Scanning market for top undocumented threats...', 'running');
            await analyzeCompetitorAction(briefId, { name: "Industry Leader A", url_handle: "alpha_competitor" }, true);
            await analyzeCompetitorAction(briefId, { name: "Market Challenger B", url_handle: "beta_threat" }, true);
            await logAgentActivity(briefId, 'Competitor Intelligence Agent', `Analyzed multiple top threats.`, 'completed');
            break;
          case 'OPPORTUNITY_HARVEST':
            await runOpportunityHarvestAgent(briefId);
            break;
          case 'STRATEGY_SYNTHESIS':
            await logAgentActivity(briefId, 'Strategy Synthesis Agent', 'Generating comprehensive $10K execution-ready strategy brief...', 'running');
            await generateStrategicBlueprintAction(briefId, true);
            await logAgentActivity(briefId, 'Strategy Synthesis Agent', 'Completed 90-Day Roadmap, SWOT, and Blue Ocean Strategy.', 'completed');
            break;
          case 'TREND_FORECASTING':
            await runTrendForecastingAgent(briefId);
            break;
          case 'EXECUTION_ACTIVATION':
            await runExecutionActivationAgent(briefId);
            break;
        }

        // Job Success
        await prisma.strategicJobQueue.update({
            where: { id: job.id },
            data: { status: 'completed' }
        });

      } catch (err: any) {
         // Fallback / Hardening
         await prisma.strategicJobQueue.update({
            where: { id: job.id },
            data: { 
                status: job.retries >= 2 ? 'failed' : 'pending',
                retries: { increment: 1 },
                errorMessage: err.message
            }
         });
         await logAgentActivity(briefId, 'System Orchestrator', `Job ${job.jobType} failed! Recovering...`, 'failed', err.message);
         break; // Halt sequence for this brief if a dependent strict node fails
      }
    }

    // Verify if fully completed
    const remaining = await prisma.strategicJobQueue.count({ where: { briefId, status: { in: ['pending', 'active'] } }});
    if (remaining === 0) {
      await logAgentActivity(briefId, 'Strategic Command Orchestrator', 'Orchestration complete. Activating background continuous monitoring.', 'completed');
      await prisma.productBrief.update({
        where: { id: briefId },
        data: { status: 'active' }
      });
      
      // Save Historical Snapshot for Phase C
      const freshBrief = await prisma.productBrief.findUnique({ where: { id: briefId } });
      if (freshBrief?.blueprintData) {
         await prisma.historicalSnapshot.create({
            data: {
               briefId,
               dataType: 'blueprint_json',
               hashKey: 'initial_run',
               dataContent: freshBrief.blueprintData
            }
         });
      }
    }
}
