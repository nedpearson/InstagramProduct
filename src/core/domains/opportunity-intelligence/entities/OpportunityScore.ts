import { TimestampedEntity } from '../../../types/common';
export interface OpportunityScore extends TimestampedEntity {
  id: string;
  briefId: string;
  totalScore: number;
  components: ScoreComponentEntity[];
}
export interface ScoreComponentEntity {
  id: string;
  componentName: string;
  value: number;
  reasoning: string;
}
