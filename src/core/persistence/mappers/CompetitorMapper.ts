import { CompetitorSnapshot } from '../../domains/competitor-intelligence/entities/CompetitorSnapshot';
export class CompetitorMapper {
  static toDomain(prismaSnapshot: any): CompetitorSnapshot {
    return {
      id: prismaSnapshot.id,
      competitorId: prismaSnapshot.competitorId,
      snapshotDate: prismaSnapshot.snapshotDate,
      metrics: prismaSnapshot.metrics || [],
      positionings: prismaSnapshot.positionings || []
    };
  }
}
