export interface StrategyReport {
  id: string;
  briefId: string;
  version: number;
  overallScore: number;
  status: 'draft' | 'qa_pending' | 'active' | 'superseded';
}
