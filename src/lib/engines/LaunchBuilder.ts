import { MonetizationFramework } from './MonetizationEngine';

export interface LaunchSequence {
  sequenceId: string;
  phases: any[];
  contentRollout: any[];
  readinessThreshold: number;
}

export class LaunchBuilder {
  /**
   * Generates full launch sequence, content rollout, post timing, funnel timing, and CTA mappings.
   */
  async generateSequence(framework: MonetizationFramework): Promise<LaunchSequence> {
    
    // Generates a 4-step sequence matching our LaunchOrchestrationAgent structure
    const sequencePhases = [
       { dayOffset: -7, phaseType: 'TEASE', cta: null },
       { dayOffset: -3, phaseType: 'AGITATE', cta: 'Join Waitlist via DM' },
       { dayOffset: 0, phaseType: 'OPEN', cta: 'Link In Bio - Cart Open' },
       { dayOffset: 3, phaseType: 'SCARCITY', cta: 'Cart Closes Tonight 11:59PM' }
    ];

    const contentRollout = sequencePhases.map(phase => ({
       targetDate: `T${phase.dayOffset > 0 ? '+' : ''}${phase.dayOffset}`,
       frameworkStage: framework.funnelStages[0] || 'Discovery',
       postType: phase.phaseType === 'OPEN' ? 'Carousel + Stories' : 'Reel',
       ctaTiming: phase.cta ? 'End of Caption + First Comment' : undefined
    }));

    return {
       sequenceId: `LAUNCH_SEQ_${Math.random().toString(36).substring(7)}`,
       phases: sequencePhases,
       contentRollout,
       readinessThreshold: 0.95 // Require 95% asset checklist before firing
    };
  }
}

export const launchBuilder = new LaunchBuilder();
