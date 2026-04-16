export type UiExecutionState = 'initializing' | 'researching_market' | 'synthesizing_strategy' | 'ready' | 'failed';
export interface AutonomousWorkspaceState {
  executionState: UiExecutionState;
  activeAlerts: Array<{ id: string; message: string; severity: string }>;
  syncTelemetry: (briefId: string) => Promise<void>;
}
