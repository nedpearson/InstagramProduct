import { BriefId, WorkspaceId } from '../types/shared';

// Requests
export interface CreateBriefRequest {
  workspaceId: string;
  niche: string;
  targetAudience: string;
  productType: string;
  overrideDefaults?: boolean;
}

export interface BriefDeltaUpdate {
  fields: Record<string, any>;
  reason?: string;
}

// Responses
export interface StrategyVM {
  briefId: string;
  status: string; // active, stale, processing
  overallScore: number;
  sections: Array<{
    type: string;
    content: string;
    confidence: number;
  }>;
  lastComputed: string;
}

export interface OpportunityScoreCardVM {
  totalScore: number;
  components: Array<{
    label: string;
    score: number;
    delta: number; // vs previous snapshot
  }>;
  isStale: boolean;
}

export interface AgentRunVM {
  runId: string;
  agentName: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  taskDescription: string;
  durationMs?: number;
}
