export interface QAReview {
  id: string;
  briefId: string;
  runId: string;
  passed: boolean;
  depthScore: number;
  consistencyScore: number;
  issues: QAIssue[];
  reviewedAt: Date;
}
export interface QAIssue {
  id: string;
  severity: string;
  issueType: string;
  description: string;
}
