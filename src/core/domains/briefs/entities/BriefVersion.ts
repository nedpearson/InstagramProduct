import { TimestampedEntity } from '../../../types/common';
export interface BriefVersion extends TimestampedEntity {
  briefId: string;
  versionNumber: number;
  rawPayload: string;
  diffSummary?: string;
}
