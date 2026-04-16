import { WorkspaceId, BriefId } from '../../types/ids';
export interface StrategicCommandOrchestrator {
  dispatchInitialBriefAutomation(briefId: BriefId, workspaceId: WorkspaceId): Promise<void>;
}
