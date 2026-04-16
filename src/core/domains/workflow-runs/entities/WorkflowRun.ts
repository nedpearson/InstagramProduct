export interface WorkflowRun {
  id: string;
  briefId: string;
  triggerEvent: string;
  status: 'queued' | 'active' | 'completed' | 'failed';
  errors: WorkflowError[];
  startedAt: Date;
  completedAt?: Date;
}
export interface WorkflowError {
  id: string;
  errorCode: string;
  errorMessage: string;
  stackTrace?: string;
}
