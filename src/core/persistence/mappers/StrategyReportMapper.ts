import { StrategyReport } from '../../domains/strategy-synthesis/entities/StrategyReport';
export class StrategyReportMapper {
  static toDomain(prismaEntity: any): StrategyReport {
    return {
      id: prismaEntity.id,
      briefId: prismaEntity.briefId,
      version: prismaEntity.version,
      overallScore: prismaEntity.overallScore,
      status: prismaEntity.status as any,
    };
  }
}
