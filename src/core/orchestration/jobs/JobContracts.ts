export enum JobType {
  BRIEF_NORMALIZATION = 'BRIEF_NORMALIZATION',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  COMPETITOR_ANALYSIS = 'COMPETITOR_ANALYSIS',
  OPPORTUNITY_SCORING = 'OPPORTUNITY_SCORING',
  STRATEGY_SYNTHESIS = 'STRATEGY_SYNTHESIS',
  MONITORING_SCAN = 'MONITORING_SCAN',
  TREND_REFRESH = 'TREND_REFRESH',
  ALERT_GENERATION = 'ALERT_GENERATION',
  QA_REVIEW = 'QA_REVIEW',
  SNAPSHOT_CREATION = 'SNAPSHOT_CREATION'
}

export enum JobPriority {
  IMMEDIATE = 1,
  DEFERRED = 2,
  RECURRING = 3,
  RECOMPUTATION = 4,
  MAINTENANCE = 5
}

export type JobPayloadMap = {
  [JobType.MARKET_RESEARCH]: { briefId: string };
  [JobType.MONITORING_SCAN]: { workspaceId: string };
  // ... other explicit mappings
};

export interface Job<T extends JobType> {
  jobId: string;
  type: T;
  payload: any;
  priority: JobPriority;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'DEAD_LETTER';
  runAfter: Date;
  maxRetries: number;
}

export interface ScheduledJob extends Job<any> {
  runAfter: Date;
}

export interface RecurringJob extends Job<any> {
  cronExpression: string;
}

export interface JobExecutionContext {
  jobId: string;
  briefId?: string;
  workspaceId: string;
  attemptCount: number;
  traceId: string;
}

export interface JobExecutionResult {
  success: boolean;
  outputPayload?: any;
}

export interface JobFailure {
  error: string;
  stack?: string;
  isRetryable: boolean;
}

export interface DeadLetterJob {
  jobId: string;
  failedAt: Date;
  failureReason: string;
  payload: any;
}

export interface JobLease {
  jobId: string;
  lockedAt: Date;
  lockedBy: string;
  expiresAt: Date;
}

export interface JobLogRecord {
  logId: string;
  jobId: string;
  message: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  timestamp: Date;
}
