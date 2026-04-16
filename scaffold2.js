const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'src', 'core');
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const touchFile = (filePath, content = '') => {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
};

console.log('Initiating Part 2 Scaffolding (Domain Entities)...');

// Briefs Domain
touchFile(path.join(ROOT, 'domains/briefs/entities/Brief.ts'), `
import { WorkspaceScopedEntity, VersionedEntity, TimestampedEntity } from '../../../types/common';
export interface Brief extends WorkspaceScopedEntity, VersionedEntity, TimestampedEntity {
  niche: string;
  topic: string;
  targetAudience: string;
  status: 'draft' | 'processing' | 'active' | 'archived';
}
`);
touchFile(path.join(ROOT, 'domains/briefs/entities/BriefVersion.ts'), `
import { TimestampedEntity } from '../../../types/common';
export interface BriefVersion extends TimestampedEntity {
  briefId: string;
  versionNumber: number;
  rawPayload: string;
  diffSummary?: string;
}
`);

// Competitor Domain
touchFile(path.join(ROOT, 'domains/competitor-intelligence/entities/Competitor.ts'), `
import { WorkspaceScopedEntity, TimestampedEntity } from '../../../types/common';
export interface Competitor extends WorkspaceScopedEntity, TimestampedEntity {
  briefId: string;
  brandName: string;
  website: string;
  isTrackingLive: boolean;
}
`);
touchFile(path.join(ROOT, 'domains/competitor-intelligence/entities/CompetitorSnapshot.ts'), `
export interface CompetitorSnapshot {
  id: string;
  competitorId: string;
  snapshotDate: Date;
  metrics: CompetitorMetric[];
  positionings: CompetitorPositioning[];
}
export interface CompetitorMetric { id: string; metricKey: string; metricValue: string; }
export interface CompetitorPositioning { id: string; positioningType: string; description: string; }
`);
touchFile(path.join(ROOT, 'domains/competitor-intelligence/entities/CompetitorDiff.ts'), `
export interface CompetitorDiff {
  id: string;
  competitorId: string;
  previousSnapshotId: string;
  newSnapshotId: string;
  diffScore: number;
  materialChanges: string[];
}
`);

// Market Intelligence Domain
touchFile(path.join(ROOT, 'domains/market-intelligence/entities/MarketResearchReport.ts'), `
import { WorkspaceScopedEntity, TimestampedEntity } from '../../../types/common';
export interface MarketResearchReport extends WorkspaceScopedEntity, TimestampedEntity {
  briefId: string;
  status: 'active' | 'stale';
  sections: MarketResearchSection[];
}
export interface MarketResearchSection { id: string; sectionKey: string; insightContent: string; confidence: number; }
`);

// Opportunity Intelligence Domain
touchFile(path.join(ROOT, 'domains/opportunity-intelligence/entities/OpportunityScore.ts'), `
import { TimestampedEntity } from '../../../types/common';
export interface OpportunityScore extends TimestampedEntity {
  id: string;
  briefId: string;
  totalScore: number;
  components: ScoreComponentEntity[];
}
export interface ScoreComponentEntity {
  id: string;
  componentName: string;
  value: number;
  reasoning: string;
}
`);

// Trend Forecasting Domain
touchFile(path.join(ROOT, 'domains/trend-forecasting/entities/TrendForecast.ts'), `
import { TimestampedEntity } from '../../../types/common';
export interface TrendForecast extends TimestampedEntity {
  id: string;
  briefId: string;
  horizonDays: number;
  signals: TrendSignal[];
}
export interface TrendSignal {
  id: string;
  topic: string;
  momentumScore: number;
  signalType: 'emerging' | 'dying' | 'blue_ocean';
}
`);

// Execution Plans Domain
touchFile(path.join(ROOT, 'domains/execution-plans/entities/ExecutionPlan.ts'), `
import { TimestampedEntity } from '../../../types/common';
export interface ExecutionPlan extends TimestampedEntity {
  id: string;
  briefId: string;
  status: 'queued' | 'applied' | 'dismissed';
  items: ExecutionPlanItem[];
}
export interface ExecutionPlanItem {
  id: string;
  type: string;
  content: string;
  impactScore: number;
}
`);

// Alerts + Monitoring Domain
touchFile(path.join(ROOT, 'domains/alerts/entities/Alert.ts'), `
import { TimestampedEntity } from '../../../types/common';
export interface Alert extends TimestampedEntity {
  id: string;
  workspaceId: string;
  briefId?: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  actionableLinks: string[];
  isDismissed: boolean;
}
`);
touchFile(path.join(ROOT, 'domains/monitoring/entities/MonitoringRule.ts'), `
import { TimestampedEntity } from '../../../types/common';
export interface MonitoringRule extends TimestampedEntity {
  id: string;
  workspaceId: string;
  targetDomain: string;
  thresholdScore: number;
  isActive: boolean;
}
`);

// QA Governance Domain
touchFile(path.join(ROOT, 'domains/qa-governance/entities/QAReview.ts'), `
export interface QAReview {
  id: string;
  briefId: string;
  runId: string;
  passed: boolean;
  depthScore: number;
  consistencyScore: number;
  issues: QAIssue[];
  reviewedAt: Date;
}
export interface QAIssue {
  id: string;
  severity: string;
  issueType: string;
  description: string;
}
`);

// Agent + Workflow Run Domain
touchFile(path.join(ROOT, 'domains/agent-runs/entities/AgentRun.ts'), `
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
`);
touchFile(path.join(ROOT, 'domains/workflow-runs/entities/WorkflowRun.ts'), `
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
`);

console.log('✔ Phase 2 Entity Scaffolding Successfully Deployed!');
