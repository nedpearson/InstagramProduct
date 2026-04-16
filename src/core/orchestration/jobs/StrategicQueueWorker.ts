import { prisma } from '@/lib/prisma';
import { JobType } from './job.contract';
import { StrategySynthesisAgent } from '../../agents/strategy-synthesis/StrategySynthesisAgent';
import { OpenAIProviderAdapter } from '../../providers/OpenAIProviderAdapter';

export class StrategicQueueWorker {
  static async processBatch(batchSize: number = 5): Promise<void> {
    const jobs = await prisma.strategicJobQueue.findMany({
      where: { status: 'pending', lockedAt: null },
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
      take: batchSize
    });

    for (const job of jobs) {
      try {
        const locked = await prisma.strategicJobQueue.update({
          where: { id: job.id, status: 'pending' },
          data: { status: 'active', lockedAt: new Date() }
        });

        // Resolve Job -> Agent mapping
        if (locked.jobType === JobType.STRATEGY_SYNTHESIS) {
            const agent = new StrategySynthesisAgent();
            const provider = new OpenAIProviderAdapter();
            
            await agent.execute({
               runId: ('run-' + Date.now()) as any,
               briefId: locked.briefId as any,
               workspaceId: 'system' as any,
               providerAdapter: provider,
               isRerun: false
            }, { briefId: locked.briefId });
        }

        // Mark Completed
        await prisma.strategicJobQueue.update({
          where: { id: locked.id },
          data: { status: 'completed' }
        });

      } catch (err: any) {
        await prisma.strategicJobQueue.update({
          where: { id: job.id },
          data: { 
             status: job.retries >= 2 ? 'failed' : 'pending',
             retries: { increment: 1 },
             errorMessage: err.message,
             lockedAt: null
          }
        });
      }
    }
  }
}
