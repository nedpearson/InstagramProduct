import { StrategyReportRepository } from './StrategyReportRepository';
import { StrategyReport } from '../../domains/strategy-synthesis/entities/StrategyReport';
import { prisma } from '@/lib/prisma';
import { StrategyReportMapper } from '../mappers/StrategyReportMapper';

export class PrismaStrategyReportRepository implements StrategyReportRepository {
  async save(report: StrategyReport): Promise<StrategyReport> {
    const saved = await prisma.strategyReport.upsert({
      where: { briefId: report.briefId },
      update: {
        overallScore: report.overallScore,
        status: report.status,
        version: { increment: 1 }
      },
      create: {
        briefId: report.briefId,
        overallScore: report.overallScore,
        status: report.status,
        version: report.version
      },
      include: {
        brief: true,
        sections: true
      }
    });
    return StrategyReportMapper.toDomain(saved);
  }

  async findLatestRender(briefId: string): Promise<StrategyReport | null> {
    const report = await prisma.strategyReport.findUnique({
      where: { briefId },
      include: { brief: true, sections: true }
    });
    return report ? StrategyReportMapper.toDomain(report) : null;
  }
  
  async supersedeOldVersions(briefId: string, currentVersion: number): Promise<void> {
      // Historical Snapshot mapping happens here
      return Promise.resolve();
  }
}
