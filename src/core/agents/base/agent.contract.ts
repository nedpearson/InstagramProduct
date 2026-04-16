import { BriefId, TraceId, WorkspaceId } from '../../types/ids';
import { ConfidenceMetrics, QualityMetrics } from '../../types/common';
import { AgentRunStatus } from '../../enums/agent-run-status.enum';

export interface AIProviderAdapter {
  providerName: string;
  generateText(prompt: string, context?: any): Promise<string>;
  generateStructured<T>(prompt: string, schema: any, context?: any): Promise<T>;
}

export interface AgentContext {
  runId: TraceId;
  briefId: BriefId;
  workspaceId: WorkspaceId;
  providerAdapter: AIProviderAdapter;
  isRerun: boolean;
}

export interface AgentResult<T> {
  status: AgentRunStatus;
  output?: T;
  evidenceLinks: string[];
  confidence: ConfidenceMetrics;
  durationMs: number;
}

export abstract class AbstractAgent<TIn, TOut> {
  abstract readonly agentName: string;
  abstract readonly maxRetries: number;

  public async execute(ctx: AgentContext, input: TIn): Promise<AgentResult<TOut>> {
    const start = Date.now();
    try {
      const result = await this.performWork(ctx, input);
      const conf = await this.calculateConfidence(result);
      if (conf.score < 60) throw new Error("Confidence Boundary Failed");
      return { status: AgentRunStatus.COMPLETED, output: result, confidence: conf, evidenceLinks: [], durationMs: Date.now() - start };
    } catch (e: any) {
      return { status: AgentRunStatus.FAILED, confidence: { score: 0, reasoning: e.message, confidenceBand: 'LOW' as const }, evidenceLinks: [], durationMs: Date.now() - start };
    }
  }
  protected abstract performWork(ctx: AgentContext, payload: TIn): Promise<TOut>;
  protected abstract calculateConfidence(payload: TOut): Promise<ConfidenceMetrics>;
}
