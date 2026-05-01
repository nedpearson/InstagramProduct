import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startAutonomousOrchestration } from '@/lib/orchestrator';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let brief = await prisma.productBrief.findFirst({
      where: { status: { in: ['draft', 'active', 'processing'] } },
      orderBy: { createdAt: 'desc' }
    });

    let alreadyOrchestrated = false;

    if (!brief) {
      const product = await prisma.product.findFirst();
      if (!product) throw new Error('No product found. Cannot execute deployment without a product.');
      
      const { createBriefAction } = await import('@/app/(app)/actions');
      await createBriefAction(product.id); // This internally calls startAutonomousOrchestration
      alreadyOrchestrated = true;
      
      brief = await prisma.productBrief.findFirst({
        where: { productId: product.id },
        orderBy: { createdAt: 'desc' }
      });
    }

    if (brief && !alreadyOrchestrated) {
      startAutonomousOrchestration(brief.id).catch(console.error);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
