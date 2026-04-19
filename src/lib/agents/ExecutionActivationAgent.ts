import { prisma } from '@/lib/prisma';
import { logAgentActivity } from '@/lib/orchestratorLogs';
import { generateBriefAction } from '@/app/(app)/actions';

export async function runExecutionActivationAgent(briefId: string) {
  try {
    await logAgentActivity(briefId, 'Execution Activation Agent', 'Translating strategy into concrete execution plans...', 'running');
    
    // Simulate generation
    await new Promise(r => setTimeout(r, 1000));

    await prisma.executionPlan.createMany({
       data: [
          { briefId, type: 'content_plan', title: 'Start Content Pillar A', content: 'Deploy 5 contrarian beliefs this week.' },
          { briefId, type: 'funnel_tweak', title: 'Update VSL Hook', content: 'Change first 30 seconds of video to match new trend.' }
       ]
    });

    // Actually trigger automated asset creation on the active calendar
    await generateBriefAction(briefId, true);

    await logAgentActivity(briefId, 'Execution Activation Agent', `Generated 2 immediate execution plans covering funnel & content. Asset mapped to Content Calendar.`, 'completed');
    return { success: true };
  } catch (error: any) {
    await logAgentActivity(briefId, 'Execution Activation Agent', 'Execution Planning Failed', 'failed', error.message);
    throw error;
  }
}
