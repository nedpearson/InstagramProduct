import { OpportunityScoreCardVM, StrategyVM, AgentRunVM } from '../ApiContracts';

export type UiExecutionState = 
  | 'initializing'
  | 'ingesting_brief'
  | 'researching_market'
  | 'analyzing_competitors'
  | 'synthesizing_strategy'
  | 'ready'
  | 'refresh_in_progress'
  | 'attention_required'
  | 'failed';

export interface AutonomousWorkspaceState {
  // Live State
  executionState: UiExecutionState;
  activeAgents: AgentRunVM[];
  
  // Data State
  strategy: StrategyVM | null;
  scoreCard: OpportunityScoreCardVM | null;
  
  // Alerts
  activeAlerts: Array<{ id: string; message: string; severity: string }>;

  // Actions
  syncTelemetry: (briefId: string) => Promise<void>;
  dismissAlert: (alertId: string) => void;
  triggerManualRefresh: (briefId: string, scope?: string[]) => Promise<void>;
}
