import { WorkspaceScopedEntity, VersionedEntity, TimestampedEntity } from '../../../types/common';
export interface Brief extends WorkspaceScopedEntity, VersionedEntity, TimestampedEntity {
  niche: string;
  topic: string;
  targetAudience: string;
  status: 'draft' | 'processing' | 'active' | 'archived';
}
