import { TimestampedEntity } from '../../../types/common';
export interface Alert extends TimestampedEntity {
  id: string;
  workspaceId: string;
  briefId?: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  actionableLinks: string[];
  isDismissed: boolean;
}
