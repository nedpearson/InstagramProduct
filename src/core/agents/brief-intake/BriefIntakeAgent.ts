import { AbstractAgent, AgentContext, AgentResult } from '../base/agent.contract';
export class BriefIntakeAgent extends AbstractAgent<any, any> {
  readonly agentName = 'BriefIntakeAgent';
  readonly maxRetries = 2;
  protected async performWork(ctx: AgentContext, payload: any): Promise<any> {
    return { data: 'Scaffolded output for BriefIntakeAgent' };
  }
  protected async calculateConfidence(payload: any) {
    return { score: 85, reasoning: "Base scaffold threshold met", confidenceBand: "HIGH" as const };
  }
}
