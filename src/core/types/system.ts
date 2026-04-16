export interface AutomationContext {
  briefId: string;
  workspaceId?: string;
  traceId: string;
  isReprocessing: boolean;
}

export interface AgentResult<T> {
  success: boolean;
  output?: T;
  evidenceLinks: string[];
  confidenceScore: number;
  durationMs: number;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}
