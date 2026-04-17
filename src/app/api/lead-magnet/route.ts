import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    // Secure lead in the central application pool
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, isActive: true, systemRole: "prospect" }
      });
    }

    // Trigger automated delivery pipeline via background job
    await prisma.backgroundJob.create({
      data: {
        jobType: 'lifecycle_email',
        payload: JSON.stringify({ userId: user.id, sequence: 'lead_magnet_delivery' }),
        status: 'pending',
        maxAttempts: 3,
        runAt: new Date()
      }
    });

    // Provide immediate hot-link fallback
    const pdfUrl = 'https://instaflow.bridgebox.ai/bridgebox_lead_magnet.md';

    return NextResponse.json({
      success: true,
      download_url: pdfUrl,
      message: 'Lead magnet effectively hijacked. Check your inbox.'
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
