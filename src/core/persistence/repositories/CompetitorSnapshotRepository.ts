import { CompetitorSnapshot } from '../../domains/competitor-intelligence/entities/CompetitorSnapshot';
export interface CompetitorSnapshotRepository {
  recordSnapshot(competitorId: string, snapshot: CompetitorSnapshot): Promise<void>;
  getLatestSnapshot(competitorId: string): Promise<CompetitorSnapshot | null>;
}
