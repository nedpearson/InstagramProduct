import { StrategyReport } from '../../domains/strategy-synthesis/entities/StrategyReport';
export interface StrategyReportRepository {
  save(report: StrategyReport): Promise<StrategyReport>;
  findLatestRender(briefId: string): Promise<StrategyReport | null>;
}
