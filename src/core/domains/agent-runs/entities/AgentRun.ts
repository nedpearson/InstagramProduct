export interface AgentRun {
  id: string;
  briefId: string;
  agentName: string;
  status: 'running' | 'completed' | 'failed';
  confidenceScore: number;
  payloadSnapshot: string;
  startedAt: Date;
  completedAt?: Date;
}
