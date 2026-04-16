import { prisma } from '@/lib/prisma';

export async function logAgentActivity(briefId: string, agentName: string, task: string, status: string = 'running', result: string | null = null) {
  if (status !== 'running') {
     const existing = await prisma.agentActivity.findFirst({
       where: { briefId, agentName, status: 'running' },
       orderBy: { createdAt: 'desc' }
     });
     if (existing) {
       return prisma.agentActivity.update({
         where: { id: existing.id },
         data: { status, result: task } // When not running, task string contains the summary
       });
     }
  }
  
  return prisma.agentActivity.create({
    data: {
      briefId,
      agentName,
      task,
      status,
      result
    }
  });
}
