export interface ExecutionPlanService {
  generatePlan(briefId: string): Promise<void>;
  applyItem(briefId: string, itemId: string): Promise<void>;
}
