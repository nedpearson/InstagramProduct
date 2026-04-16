import { prisma } from '@/lib/prisma';
import { Logger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

export interface AgentContext {
  briefId?: string;
  workspaceId: string;
  runId: string;
  memoryData?: any;
}

export abstract class BaseAgent<TInput, TOutput> {
  protected agentName: string;
  
  constructor(agentName: string) {
    this.agentName = agentName;
  }

  // To be implemented by each specific agent
  protected abstract execute(input: TInput, context: AgentContext): Promise<TOutput>;

  /**
   * Universal runner for all agents. Handles logging, memory context mapping, execution, and error capturing.
   */
  public async run(input: TInput, contextData: Partial<AgentContext>): Promise<TOutput | null> {
    const runId = uuidv4();
    const context: AgentContext = {
      runId,
      workspaceId: contextData.workspaceId!,
      briefId: contextData.briefId,
      memoryData: {}
    };

    try {
      Logger.info('agent', `[${this.agentName}] Started execution`, { runId, input });

      // Create AgentActivity Record
      await this.logActivity(context, 'running', `Executing ${this.agentName}`, input);

      // Extract relevant memory from LearningMemory if briefId/workspace exists
      const memory = await this.retrieveMemoryContext(context);
      context.memoryData = memory;

      // 💥 EXECUTE INNER LOGIC
      const output = await this.execute(input, context);

      // Log success and activity update
      await this.logActivity(context, 'completed', `Finished ${this.agentName}`, output);
      Logger.info('agent', `[${this.agentName}] Successfully completed`, { runId, output });

      return output;

    } catch (err: any) {
      Logger.error('agent', `[${this.agentName}] Failed execution`, { runId, error: err.message, stack: err.stack });
      await this.logActivity(context, 'failed', `Failed ${this.agentName}: ${err.message}`, { error: err.message });
      
      // Attempt generic self-healing if blocked (spawning subagents)
      await this.handleFailureWithSubagent(input, context, err);
      
      return null;
    }
  }

  protected async spawnSubagent(subagentType: string, payload: any, context: AgentContext) {
    Logger.info('agent', `[${this.agentName}] Spawning subagent: ${subagentType}`, { runId: context.runId });
    // Queues task into StrategicJobQueue for async processor to pick up
    await prisma.strategicJobQueue.create({
      data: {
        jobType: `SUBAGENT_${subagentType}`,
        briefId: context.briefId || 'SYSTEM',
        payload: JSON.stringify({ ...payload, runId: context.runId, workspaceId: context.workspaceId }),
        status: 'pending',
        priority: 10 // subagents typically get higher priority
      }
    });
  }

  private async retrieveMemoryContext(context: AgentContext) {
    if (!context.workspaceId) return null;
    const memories = await prisma.learningMemory.findMany({
      where: { workspaceId: context.workspaceId },
      orderBy: { confidence: 'desc' },
      take: 5
    });
    return memories;
  }

  public async saveLearning(context: AgentContext, insightContext: string, insight: string, confidence: number = 0.8, sourceInfo?: any) {
    await prisma.learningMemory.create({
      data: {
        workspaceId: context.workspaceId,
        context: insightContext,
        insight,
        confidence,
        sourceData: sourceInfo ? JSON.stringify(sourceInfo) : null
      }
    });
  }

  private async logActivity(context: AgentContext, status: string, task: string, data?: any) {
    if (!context.briefId) return; // Only log activity if bound to a brief
    try {
      await prisma.agentActivity.upsert({
        where: { runId: context.runId },
        update: { status, result: data ? JSON.stringify(data) : undefined },
        create: {
          runId: context.runId,
          briefId: context.briefId,
          agentName: this.agentName,
          task,
          status,
          result: data ? JSON.stringify(data) : undefined
        }
      });
    } catch(e) {
      Logger.error('agent', 'Failed to log AgentActivity', { error: e });
    }
  }

  private async handleFailureWithSubagent(input: any, context: AgentContext, error: any) {
    Logger.warn('agent', `[${this.agentName}] Auto-spawning Debug/Self-Healing Subagent`, { runId: context.runId });
    await this.spawnSubagent('DEBUG_REPAIR', { 
       failedAgent: this.agentName,
       originalInput: input,
       errorMessage: error.message 
    }, context);
  }
}
