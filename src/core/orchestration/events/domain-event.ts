import { WorkspaceId } from '../../types/ids';
export interface DomainEvent<T> {
  eventId: string;
  eventType: string;
  correlationId: string;
  occurredAt: Date;
  entityId: string;
  workspaceId: WorkspaceId;
  payload: T;
}
