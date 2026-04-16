import { TimestampedEntity } from '../../../types/common';
export interface ExecutionPlan extends TimestampedEntity {
  id: string;
  briefId: string;
  status: 'queued' | 'applied' | 'dismissed';
  items: ExecutionPlanItem[];
}
export interface ExecutionPlanItem {
  id: string;
  type: string;
  content: string;
  impactScore: number;
}
