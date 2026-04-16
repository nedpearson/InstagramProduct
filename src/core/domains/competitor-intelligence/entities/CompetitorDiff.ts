export interface CompetitorDiff {
  id: string;
  competitorId: string;
  previousSnapshotId: string;
  newSnapshotId: string;
  diffScore: number;
  materialChanges: string[];
}
