export interface RefreshDecisionService {
  evaluateDrift(briefId: string): Promise<string>;
}
