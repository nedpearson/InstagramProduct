export interface QAReviewService {
  executeReview(briefId: string, runId: string, dataBlob: any): Promise<boolean>;
}
