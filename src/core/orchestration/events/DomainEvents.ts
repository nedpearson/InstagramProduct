export enum EventType {
  BriefCreated = 'BriefCreated',
  BriefUpdated = 'BriefUpdated',
  BriefNormalized = 'BriefNormalized',
  
  CompetitorDiscovered = 'CompetitorDiscovered',
  CompetitorSnapshotCreated = 'CompetitorSnapshotCreated',
  CompetitorDataChanged = 'CompetitorDataChanged',
  
  MarketResearchCompleted = 'MarketResearchCompleted',
  OpportunityHarvestCompleted = 'OpportunityHarvestCompleted',
  
  StrategyGenerated = 'StrategyGenerated',
  StrategySuperseded = 'StrategySuperseded',
  
  OpportunityScoreComputed = 'OpportunityScoreComputed',
  TrendForecastUpdated = 'TrendForecastUpdated',
  ExecutionPlanGenerated = 'ExecutionPlanGenerated',
  
  MonitoringSignalDetected = 'MonitoringSignalDetected',
  StrategyRefreshRequired = 'StrategyRefreshRequired',
  AlertGenerated = 'AlertGenerated',
  
  QAReviewFailed = 'QAReviewFailed',
  QAReviewPassed = 'QAReviewPassed',
  
  AgentRunStarted = 'AgentRunStarted',
  AgentRunCompleted = 'AgentRunCompleted',
  AgentRunFailed = 'AgentRunFailed',
  
  WorkflowRunStarted = 'WorkflowRunStarted',
  WorkflowRunCompleted = 'WorkflowRunCompleted',
  WorkflowRunFailed = 'WorkflowRunFailed'
}

export interface DomainEvent<T> {
  eventId: string;
  eventType: EventType;
  correlationId: string;
  causationId?: string;
  occurredAt: Date;
  actorType: 'SYSTEM' | 'USER';
  entityId: string;
  entityType: string;
  workspaceId: string;
  version: number;
  payload: T;
}

export type BriefCreatedEvent = DomainEvent<{ briefId: string }>;
export type BriefUpdatedEvent = DomainEvent<{ briefId: string; changedFields: string[] }>;
export type CompetitorDataChangedEvent = DomainEvent<{ competitorId: string; diffScore: number }>;
export type StrategyRefreshRequiredEvent = DomainEvent<{ briefId: string; reason: string }>;
export type AlertGeneratedEvent = DomainEvent<{ alertId: string; severity: string; message: string }>;
