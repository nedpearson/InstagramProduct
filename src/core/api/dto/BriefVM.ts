export interface CreateBriefRequest {
  workspaceId: string;
  niche: string;
  targetAudience: string;
}
export interface BriefDetailVM {
  id: string;
  niche: string;
  status: string;
  version: number;
}
