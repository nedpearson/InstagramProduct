export interface CompetitorSnapshot {
  id: string;
  competitorId: string;
  snapshotDate: Date;
  metrics: CompetitorMetric[];
  positionings: CompetitorPositioning[];
}
export interface CompetitorMetric { id: string; metricKey: string; metricValue: string; }
export interface CompetitorPositioning { id: string; positioningType: string; description: string; }
