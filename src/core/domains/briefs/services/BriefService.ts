export interface BriefService {
  createBrief(workspaceId: string, payload: any): Promise<string>;
  archiveBrief(briefId: string): Promise<void>;
}
