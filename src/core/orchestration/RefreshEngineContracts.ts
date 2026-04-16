import { BriefId, DiffSummary, MaterialChangeAssessment } from '../types/shared';
import { RefreshScope } from './workflows/OrchestratorContracts';

export interface RefreshDecisionEngine {
  evaluateDrift(briefId: BriefId): Promise<RefreshDecision>;
  calculateCompetitorImpact(competitorDiff: DiffSummary): MaterialChangeAssessment;
  calculateTrendImpact(trendShift: number): MaterialChangeAssessment;
}

export interface RefreshDecision {
  requiresAction: boolean;
  actionType: 'SILENT_IGNORE' | 'UI_ALERT_ONLY' | 'PARTIAL_RECOMPUTE' | 'FULL_RECOMPUTE';
  scope?: RefreshScope;
  reasoning: string;
}

export interface AlertTriggerEngine {
  dispatchAlert(briefId: BriefId, severity: string, message: string, actionableLinks: string[]): Promise<void>;
}
