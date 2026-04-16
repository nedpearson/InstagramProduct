import { WorkspaceId } from './ids';
export interface TimestampedEntity { createdAt: Date; updatedAt: Date; }
export interface VersionedEntity { id: string; version: number; }
export interface WorkspaceScopedEntity { workspaceId: WorkspaceId; }
export interface ConfidenceMetrics { score: number; reasoning: string; confidenceBand: 'LOW' | 'MEDIUM' | 'HIGH'; }
export interface QualityMetrics { depthScore: number; consistencyScore: number; issueList: string[]; }
