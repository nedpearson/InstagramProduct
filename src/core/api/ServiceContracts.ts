import { BriefId, WorkspaceId } from '../types/shared';

export interface BriefManagementService {
  createBrief(workspaceId: WorkspaceId, initialData: any): Promise<BriefId>;
  updateBrief(briefId: BriefId, delta: any): Promise<void>;
  archiveBrief(briefId: BriefId): Promise<void>;
}

export interface CompetitorIntelligenceService {
  forceScanCompetitor(briefId: BriefId, handle: string): Promise<void>;
  evaluateDiffs(briefId: BriefId): Promise<boolean>; // Returns true if material shift
}

export interface StrategySynthesisService {
  triggerFullRegeneration(briefId: BriefId): Promise<void>;
  triggerPartialRegeneration(briefId: BriefId, sections: string[]): Promise<void>;
}

export interface TrendForecastingService {
  analyzeSignals(briefId: BriefId): Promise<any[]>;
  publishAlerts(briefId: BriefId, alerts: any[]): Promise<void>;
}

export interface QaGovernanceService {
  evaluateArtifact(briefId: BriefId, runId: string, payload: any): Promise<boolean>;
}
