import { 
  BriefId, 
  WorkspaceId, 
  TraceId, 
  AgentRunStatus, 
  ConfidenceMetrics, 
  QualityMetrics, 
  EvidenceReference 
} from '../../types/shared';

export interface AIProviderAdapter {
  providerName: string;
  generateText(prompt: string, context?: any): Promise<string>;
  generateStructured<T>(prompt: string, schema: any, context?: any): Promise<T>;
}

export interface AgentContext {
  runId: TraceId;
  parentRunId?: TraceId;
  briefId: BriefId;
  workspaceId: WorkspaceId;  // Enforced workspace isolation
  providerAdapter: AIProviderAdapter; // Enforced future-proofing
  isRerun: boolean;
  rerunScope?: string[];
}

export type AgentDependencyMap = Record<string, any>;

export interface AgentInput<T> {
  payload: T;
  dependencies: AgentDependencyMap;
}

export interface AgentOutput<T> {
  result: T;
}

export interface AgentFailure {
  code: string;
  message: string;
  stack?: string;
  isRetryable: boolean;
}

export interface AgentResult<T> {
  status: AgentRunStatus;
  output?: AgentOutput<T>;
  evidence: AgentEvidence;
  confidence: ConfidenceMetrics;
  quality?: QualityMetrics;
  failure?: AgentFailure;
  durationMs: number;
}

export interface AgentExecutionPolicy {
  retryPolicy: AgentRetryPolicy;
  timeoutPolicy: AgentTimeoutPolicy;
  qualityThreshold: AgentQualityThreshold;
}

export interface AgentRetryPolicy {
  maxRetries: number;
  backoffMs: number;
}

export interface AgentTimeoutPolicy {
  timeoutMs: number;
}

export interface AgentQualityThreshold {
  minConfidenceScore: number;
  minDepthScore: number;
}

export interface AgentEvidence {
  references: EvidenceReference[];
}

export interface AgentRunRecord {
  id: string;
  agentName: string;
  traceId: TraceId;
  status: AgentRunStatus;
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
}

export interface AgentTaskRecord {
  taskId: string;
  agentRunId: string;
  taskName: string;
  status: AgentRunStatus;
}

export interface Subagent<TIn, TOut> {
  readonly subagentName: string;
  execute(ctx: AgentContext, input: TIn): Promise<TOut>;
}

export abstract class BaseAgent<TIn, TOut> {
  abstract readonly agentName: string;
  abstract readonly executionPolicy: AgentExecutionPolicy;

  public async execute(ctx: AgentContext, input: AgentInput<TIn>): Promise<AgentResult<TOut>> {
    const startTime = Date.now();
    await this.logStart(ctx);

    try {
      this.validateInput(input);
      const dependencies = this.resolveDependencies(input.dependencies);
      
      const rawOutput = await this.performWork(ctx, input.payload, dependencies);
      
      const confidence = await this.calculateConfidence(rawOutput);
      const quality = await this.calculateQuality(rawOutput);
      
      this.enforceQualityThresholds(confidence, quality);

      const result: AgentResult<TOut> = {
        status: AgentRunStatus.COMPLETED,
        output: { result: rawOutput },
        evidence: this.extractEvidence(rawOutput),
        confidence,
        quality,
        durationMs: Date.now() - startTime
      };

      await this.logSuccess(ctx, result);
      return result;

    } catch (err: any) {
      await this.logFailure(ctx, err);
      return {
        status: AgentRunStatus.FAILED,
        evidence: { references: [] },
        confidence: { score: 0, reasoning: 'Failed execution', confidenceBand: 'LOW' },
        durationMs: Date.now() - startTime,
        failure: {
          code: err.code || 'UNKNOWN_ERROR',
          message: err.message,
          isRetryable: true
        }
      };
    }
  }

  protected abstract performWork(ctx: AgentContext, payload: TIn, deps: AgentDependencyMap): Promise<TOut>;
  
  // Validation Hooks
  protected validateInput(input: AgentInput<TIn>): void {
     // override to throw if invalid
  }

  protected resolveDependencies(deps: AgentDependencyMap): AgentDependencyMap {
     return deps;
  }

  // Scoring Hooks
  protected abstract calculateConfidence(payload: TOut): Promise<ConfidenceMetrics>;
  protected calculateQuality(payload: TOut): Promise<QualityMetrics | undefined> {
     return Promise.resolve(undefined);
  }

  protected extractEvidence(payload: TOut): AgentEvidence {
     return { references: [] };
  }

  private enforceQualityThresholds(confidence: ConfidenceMetrics, quality?: QualityMetrics) {
      if (confidence.score < this.executionPolicy.qualityThreshold.minConfidenceScore) {
          throw new Error('Confidence below minimum threshold');
      }
  }

  // Telemetry Hooks
  private async logStart(ctx: AgentContext) {}
  private async logSuccess(ctx: AgentContext, res: AgentResult<TOut>) {}
  private async logFailure(ctx: AgentContext, err: any) {}

  // Rerun hooks
  public async executePartialRerun(ctx: AgentContext, input: AgentInput<TIn>): Promise<AgentResult<TOut>> {
      return this.execute({ ...ctx, isRerun: true }, input);
  }
}
