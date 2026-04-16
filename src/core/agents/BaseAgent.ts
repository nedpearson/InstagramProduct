import { AgentResult, AutomationContext } from '../types/system';
import { prisma } from '@/lib/prisma';

export abstract class StrategicAgent<TInput, TOutput> {
  abstract readonly agentName: string;
  abstract readonly maxRetries: number;
  protected timeoutMs = 60000;

  public async execute(ctx: AutomationContext, payload: TInput): Promise<AgentResult<TOutput>> {
    const startTime = Date.now();
    await this.logStart(ctx);

    try {
      const output = await this.performWork(ctx, payload);
      const confidence = await this.calculateConfidence(output);
      
      const result: AgentResult<TOutput> = {
        success: true,
        output,
        confidenceScore: confidence,
        evidenceLinks: this.extractEvidence(output),
        durationMs: Date.now() - startTime
      };
      
      await this.logSuccess(ctx, result);
      return result;

    } catch (err: any) {
      await this.logFailure(ctx, err);
      return {
        success: false,
        confidenceScore: 0,
        evidenceLinks: [],
        durationMs: Date.now() - startTime,
        error: { code: 'AGENT_FAULT', message: err.message, retryable: true }
      };
    }
  }

  protected abstract performWork(ctx: AutomationContext, payload: TInput): Promise<TOutput>;
  protected abstract calculateConfidence(payload: TOutput): Promise<number>;
  
  protected extractEvidence(payload: TOutput): string[] { 
    return []; 
  }
  
  private async logStart(ctx: AutomationContext) {
    if (!ctx.briefId) return;
    
    // Fallback safe payload JSON
    const safePayload = JSON.stringify({ 
       traceId: ctx.traceId, 
       isReprocessing: ctx.isReprocessing 
    });

    try {
        await prisma.agentActivity.create({
            data: {
                runId: ctx.traceId + '-' + Date.now(),
                briefId: ctx.briefId,
                agentName: this.agentName,
                status: 'running',
                payloadSnapshot: safePayload
            }
        });
    } catch (e) {
        // Logging fails shouldn't break the agent
        console.error("Telemetry failed to start", e);
    }
  }

  private async logSuccess(ctx: AutomationContext, res: AgentResult<TOutput>) {
     if (!ctx.briefId) return;
     // Update the running activity...
     const existing = await prisma.agentActivity.findFirst({
         where: { briefId: ctx.briefId, agentName: this.agentName, status: 'running' },
         orderBy: { createdAt: 'desc' }
     });
     
     if (existing) {
         await prisma.agentActivity.update({
             where: { id: existing.id },
             data: { 
                 status: 'completed', 
                 durationMs: res.durationMs,
                 confidence: res.confidenceScore,
             }
         });
     }
  }
  
  private async logFailure(ctx: AutomationContext, err: any) {
     if (!ctx.briefId) return;
     const existing = await prisma.agentActivity.findFirst({
         where: { briefId: ctx.briefId, agentName: this.agentName, status: 'running' },
         orderBy: { createdAt: 'desc' }
     });
     
     if (existing) {
         await prisma.agentActivity.update({
             where: { id: existing.id },
             data: { 
                 status: 'failed', 
                 payloadSnapshot: JSON.stringify({ error: err.message })
             }
         });
     }
  }
}
