export type WorkspaceId = string & { readonly __brand: unique symbol };
export type BriefId = string & { readonly __brand: unique symbol };
export type TraceId = string & { readonly __brand: unique symbol };
export type JobId = string & { readonly __brand: unique symbol };

export interface TimestampedEntity {
  createdAt: Date;
  updatedAt: Date;
}

export interface VersionedEntity {
  id: string;
  version: number;
}

export interface WorkspaceScopedEntity {
  workspaceId: WorkspaceId;
}

export interface ConfidenceMetrics {
  score: number; // 0-100
  reasoning: string;
  confidenceBand: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface QualityMetrics {
  depthScore: number;
  consistencyScore: number;
  issueList: string[];
}

export interface EvidenceReference {
  type: 'URL' | 'SERP' | 'SOCIAL' | 'FILE';
  source: string;
  timestamp: Date;
}

export interface DiffSummary {
  materialChange: boolean;
  scoreDelta: number;
  fieldsChanged: string[];
}

export interface MaterialChangeAssessment {
  isMaterial: boolean;
  impactedDomains: string[];
  recomputationScope: 'FULL' | 'PARTIAL' | 'NONE';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: ErrorResult;
}

export interface ErrorResult {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export enum AgentRunStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SUPERSEDED = 'SUPERSEDED'
}

export enum WorkflowRunStatus {
  QUEUED = 'QUEUED',
  ACTIVE = 'ACTIVE',
  PARTIAL_SUCCESS = 'PARTIAL_SUCCESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export enum ScoreComponent {
  MARKET_DEMAND = 'MARKET_DEMAND',
  COMPETITION = 'COMPETITION',
  VIRALITY = 'VIRALITY',
  MONETIZATION = 'MONETIZATION'
}

export enum MonitoringSignal {
  TREND_SHIFT = 'TREND_SHIFT',
  COMPETITOR_CHANGE = 'COMPETITOR_CHANGE',
  SCORE_DRIFT = 'SCORE_DRIFT'
}
