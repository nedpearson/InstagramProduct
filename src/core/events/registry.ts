export enum DomainEventType {
  BRIEF_CREATED = 'BRIEF_CREATED',
  COMPETITOR_CHANGE_DETECTED = 'COMPETITOR_CHANGE_DETECTED',
  STRATEGY_GENERATION_FAILED = 'STRATEGY_GENERATION_FAILED',
  TREND_SHIFT_ALERT = 'TREND_SHIFT_ALERT'
}

export interface DomainEventPayloads {
  [DomainEventType.BRIEF_CREATED]: { briefId: string, workspaceId: string };
  [DomainEventType.COMPETITOR_CHANGE_DETECTED]: { briefId: string, competitorId: string, diffScore: number };
  [DomainEventType.STRATEGY_GENERATION_FAILED]: { briefId: string, agentName: string, reason: string };
  [DomainEventType.TREND_SHIFT_ALERT]: { briefId: string, trendSignalId: string, shiftMagnitude: number };
}

export type TypedSystemEvent<T extends DomainEventType> = {
  eventId: string;
  type: T;
  payload: DomainEventPayloads[T];
  timestamp: Date;
}
