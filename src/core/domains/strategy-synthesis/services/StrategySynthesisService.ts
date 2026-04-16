export interface StrategySynthesisService {
  triggerFullRegeneration(briefId: string, workspaceId: string): Promise<void>;
}
