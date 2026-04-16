export interface ExecutionPlanVM {
  id: string;
  briefId: string;
  items: Array<{ type: string; content: string; impactScore: number; }>;
}
