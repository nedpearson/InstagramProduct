import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startAutonomousOrchestration } from '@/lib/orchestrator';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Check if there's any active brief, if so, trigger its orchestration
    // If none exists, create a dummy one or grab latest
    let brief = await prisma.productBrief.findFirst({
      where: { status: { in: ['draft', 'active', 'processing'] } },
      orderBy: { createdAt: 'desc' }
    });

    if (brief) {
      startAutonomousOrchestration(brief.id).catch(console.error);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
