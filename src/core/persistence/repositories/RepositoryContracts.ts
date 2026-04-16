import { PaginatedResult } from '../../types/shared';

export interface BaseRepository<TEntity, TId> {
  findById(id: TId): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
  delete(id: TId): Promise<boolean>;
}

export interface BriefRepository extends BaseRepository<any, string> {
  findByWorkspaceId(workspaceId: string, page: number): Promise<PaginatedResult<any>>;
  updateStatus(briefId: string, status: string): Promise<void>;
}

export interface CompetitorRepository extends BaseRepository<any, string> {
  findByBriefId(briefId: string): Promise<any[]>;
  recordSnapshot(competitorId: string, data: any): Promise<void>;
}

export interface JobQueueRepository {
  enqueue(jobType: string, briefId: string, payload: any, priority: number): Promise<string>;
  leaseNextBatch(limit: number): Promise<any[]>;
  markCompleted(jobId: string): Promise<void>;
  recordFailure(jobId: string, errorMessage: string, isRetryable: boolean): Promise<void>;
}

export interface SnapshotRepository {
  createSnapshot(briefId: string, type: string, hashKey: string, content: string): Promise<void>;
  getLatestHash(briefId: string, type: string): Promise<string | null>;
}
