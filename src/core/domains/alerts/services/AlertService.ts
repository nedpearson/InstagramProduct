export interface AlertService {
  publishAlert(workspaceId: string, briefId: string, severity: string, message: string): Promise<void>;
  dismissAlert(alertId: string): Promise<void>;
}
