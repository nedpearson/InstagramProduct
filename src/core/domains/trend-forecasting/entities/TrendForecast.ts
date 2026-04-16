import { TimestampedEntity } from '../../../types/common';
export interface TrendForecast extends TimestampedEntity {
  id: string;
  briefId: string;
  horizonDays: number;
  signals: TrendSignal[];
}
export interface TrendSignal {
  id: string;
  topic: string;
  momentumScore: number;
  signalType: 'emerging' | 'dying' | 'blue_ocean';
}
