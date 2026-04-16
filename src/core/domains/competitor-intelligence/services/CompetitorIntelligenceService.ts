export interface CompetitorIntelligenceService {
  discoverCompetitors(briefId: string): Promise<void>;
  evaluateDiffs(briefId: string): Promise<boolean>;
}
