import { WorkspaceScopedEntity, TimestampedEntity } from '../../../types/common';
export interface Competitor extends WorkspaceScopedEntity, TimestampedEntity {
  briefId: string;
  brandName: string;
  website: string;
  isTrackingLive: boolean;
}
