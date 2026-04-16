import { BaseAgent, AgentContext } from '../core/BaseAgent';

export class ContentStrategyAgent extends BaseAgent<any, any> {
  constructor() { super('ContentStrategyAgent'); }

  protected async execute(input: any, context: AgentContext): Promise<any> {
    // Generate strategic content plans, build posting calendars, map content pillars
    const pillars = ['Authority', 'Growth', 'Sales', 'Vulnerability'];
    
    // Check memory to adapt strategy
    const previousLearnings = context.memoryData || [];
    let focusedPillar = 'Sales'; // default

    if (previousLearnings.find((l: any) => l.insight.includes('vulnerable'))) {
        focusedPillar = 'Vulnerability';
    }

    const postingCalendar = {
      schedule: [
         { day: 'Mon', pillar: 'Authority', format: 'Carousel' },
         { day: 'Wed', pillar: focusedPillar, format: 'Reel' },
         { day: 'Fri', pillar: 'Sales', format: 'Story Sequence' }
      ]
    };

    // Spawn Creative Generation subagent to execute on this calendar
    await this.spawnSubagent('CREATIVE_GENERATOR', { calendar: postingCalendar }, context);

    return postingCalendar;
  }
}
