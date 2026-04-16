import { AbstractAgent, AgentContext, AgentResult } from '../base/agent.contract';
export class OfferStackAnalyzerSubagent extends AbstractAgent<any, any> {
  readonly agentName = 'OfferStackAnalyzerSubagent';
  readonly maxRetries = 2;
  protected async performWork(ctx: AgentContext, payload: any): Promise<any> {
    return { data: 'Scaffolded output for OfferStackAnalyzerSubagent' };
  }
  protected async calculateConfidence(payload: any) {
    return { score: 85, reasoning: "Base scaffold threshold met", confidenceBand: "HIGH" as const };
  }
}
