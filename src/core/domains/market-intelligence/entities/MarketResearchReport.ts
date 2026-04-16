import { WorkspaceScopedEntity, TimestampedEntity } from '../../../types/common';
export interface MarketResearchReport extends WorkspaceScopedEntity, TimestampedEntity {
  briefId: string;
  status: 'active' | 'stale';
  sections: MarketResearchSection[];
}
export interface MarketResearchSection { id: string; sectionKey: string; insightContent: string; confidence: number; }
