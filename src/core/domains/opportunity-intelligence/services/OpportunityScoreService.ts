export interface OpportunityScoreService {
  recomputeScores(briefId: string): Promise<void>;
}
