export interface WorkflowRunService {
  execute(params: any): Promise<any>;
}
