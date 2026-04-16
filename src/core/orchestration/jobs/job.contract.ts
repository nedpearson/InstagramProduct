export enum JobType { MARKET_RESEARCH = 'MARKET_RESEARCH', STRATEGY_SYNTHESIS = 'STRATEGY_SYNTHESIS', QA_REVIEW = 'QA_REVIEW' }
export interface Job<T> {
  jobId: string;
  type: JobType;
  payload: T;
  priority: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  runAfter: Date;
}
export interface JobHandler<T> {
  readonly type: JobType;
  handle(ctx: any, payload: T): Promise<void>;
}
