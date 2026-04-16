export interface OpportunityScoreCardVM {
  totalScore: number;
  components: Array<{ label: string; score: number; delta: number; }>;
  isStale: boolean;
}
