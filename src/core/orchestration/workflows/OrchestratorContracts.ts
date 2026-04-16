export interface WorkflowStep {
  id: string;
  jobType: string;
  payloadBuilder: (context: WorkflowRunContext) => any;
}

export interface WorkflowDependencyGraph {
  nodes: WorkflowStep[];
  edges: Array<{ from: string; to: string }>;
}

export interface WorkflowDefinition {
  workflowId: string;
  name: string;
  triggerEvent: string;
  buildGraph: (context: WorkflowRunContext) => WorkflowDependencyGraph;
}

export interface WorkflowRunContext {
  runId: string;
  briefId: string;
  workspaceId: string;
  triggeringEventId: string;
  resolvedOutputs: Record<string, any>;
}

export interface WorkflowRunResult {
  runId: string;
  status: 'COMPLETED' | 'FAILED' | 'PARTIAL_SUCCESS';
  completedSteps: string[];
  failedSteps: string[];
  error?: string;
}

export interface ReprocessingDecision {
  shouldReprocess: boolean;
  affectedSteps: string[];
}

export interface RefreshDecision {
  requiresRefresh: boolean;
  refreshScope: RefreshScope;
}

export enum RefreshScope {
  FULL = 'FULL',
  SCORES_ONLY = 'SCORES_ONLY',
  SECTIONS_ONLY = 'SECTIONS_ONLY'
}

export interface SupersessionPolicy {
  markOldAsStale: boolean;
  hardDeleteOld: boolean;
}

export interface PublishPolicy {
  requiresQaPass: boolean;
  autoPublish: boolean;
}

export interface StrategicCommandOrchestrator {
  dispatchInitialBriefAutomation(briefId: string, workspaceId: string): Promise<WorkflowRunResult>;
  handleBriefUpdateReprocessing(eventPayload: any): Promise<WorkflowRunResult>;
  handleCompetitorChangeRefresh(eventPayload: any): Promise<WorkflowRunResult>;
  handleTrendShiftRefresh(eventPayload: any): Promise<WorkflowRunResult>;
  executeScheduledMonitoring(workspaceId: string): Promise<void>;
}
