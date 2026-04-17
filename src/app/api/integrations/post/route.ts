import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { assetId } = payload;

    if (!assetId) {
      return NextResponse.json({ status: "error", message: "Missing assetId" }, { status: 400 });
    }

    // Queue the physical execution task
    await prisma.backgroundJob.create({
      data: {
        jobType: 'publish_content',
        payload: JSON.stringify({ assetId }),
        status: 'pending',
        runAt: new Date(),
        maxAttempts: 3
      }
    });

    return NextResponse.json({ 
      status: "queued", 
      message: "Post successfully scheduled for physical Graph API execution." 
    });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
