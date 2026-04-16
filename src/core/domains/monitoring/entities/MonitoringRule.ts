import { TimestampedEntity } from '../../../types/common';
export interface MonitoringRule extends TimestampedEntity {
  id: string;
  workspaceId: string;
  targetDomain: string;
  thresholdScore: number;
  isActive: boolean;
}
