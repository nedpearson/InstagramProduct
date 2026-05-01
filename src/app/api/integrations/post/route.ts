import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    console.log(`[CRON] ⏰ Running Autonomous Schedule & Publish Loop...`);

    // 1. Process due schedules and queue them
    const dueSchedules = await prisma.schedule.findMany({
      where: { scheduledFor: { lte: new Date() }, status: 'pending' },
      include: { variant: true }
    });

    for (const sched of dueSchedules) {
      console.log(`[CRON] ⏰ Schedule ${sched.id} reached post window! Transmitting to active queue...`);
      await prisma.backgroundJob.create({
        data: {
          jobType: 'publish_content',
          payload: JSON.stringify({ assetId: sched.variant.assetId }),
          status: 'pending',
          maxAttempts: 3,
          runAt: new Date()
        }
      });

      await prisma.schedule.update({
        where: { id: sched.id },
        data: { status: 'published' }
      });
    }

    // 2. Execute pending publish_content jobs
    const pendingJobs = await prisma.backgroundJob.findMany({
      where: { 
        status: 'pending', 
        runAt: { lte: new Date() },
        jobType: 'publish_content'
      },
      take: 10
    });

    for (const job of pendingJobs) {
      console.log(`[CRON] Processing job: ${job.id} type: ${job.jobType}`);
      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: { status: 'running', attempts: { increment: 1 } }
      });

      let success = true;
      let errorMessage = '';

      try {
        const payload = JSON.parse(job.payload || '{}');
        if (!payload.assetId) throw new Error('Missing assetId in payload');
        
        const asset = await prisma.contentAsset.findUnique({ where: { id: payload.assetId }});
        if (!asset) throw new Error('Asset not found');

        console.log(`[CRON] 📡 Connecting to Meta Graph API for Asset ${asset.id}...`);
        let token = process.env.META_ADS_ACCESS_TOKEN;
        const integrationToken = await prisma.integrationToken.findFirst({
          where: { provider: 'meta_graph' },
          orderBy: { createdAt: 'desc' }
        });
        if (integrationToken) {
          token = integrationToken.encryptedToken;
        }
        if (!token) throw new Error('Missing META_ADS_ACCESS_TOKEN');

        const pagesReq = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${token}`);
        const pagesData = await pagesReq.json();
        const igBusId = pagesData?.data?.[0]?.instagram_business_account?.id;

        if (!igBusId) throw new Error("Graph API physical failure: No Instagram Business Account linked to this Token's pages.");

        const physicalImageUrl = 'https://raw.githubusercontent.com/nedpearson/InstagramProduct/main/public/branding.png';
        let uploadData: any = null;
        let publishData: any = null;
        let attempts = 0;

        while (attempts < 3) {
          try {
            attempts++;
            const uploadReq = await fetch(`https://graph.facebook.com/v18.0/${igBusId}/media?caption=${encodeURIComponent(asset.notes || asset.title)}&image_url=${encodeURIComponent(physicalImageUrl)}&access_token=${token}`, { method: 'POST' });
            uploadData = await uploadReq.json();
            
            if (uploadData.error) throw new Error(`Meta Upload Rejection: ${JSON.stringify(uploadData.error)}`);
            
            const publishReq = await fetch(`https://graph.facebook.com/v18.0/${igBusId}/media_publish?creation_id=${uploadData.id}&access_token=${token}`, { method: 'POST' });
            publishData = await publishReq.json();
            
            if (publishData.error) throw new Error(`Meta Publish Rejection: ${JSON.stringify(publishData.error)}`);
            
            break; // Success
          } catch (e: any) {
            if (attempts >= 3) {
              await prisma.reviewTask.create({
                data: {
                   entityType: 'instagram_rejection',
                   entityId: asset.id,
                   reason: `Graph API rejected upload 3 times. Last Error: ${e.message}`
                }
              });
              throw new Error('Graph API sequence aborted after 3 retries.');
            }
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }

        await prisma.contentAsset.update({
          where: { id: asset.id },
          data: { status: 'published' }
        });

        console.log(`[CRON] ✅ SUCCESS: Asset live on Instagram. IG Post ID: ${publishData.id}`);

      } catch (e: any) {
        success = false;
        errorMessage = e.message || 'Unknown error';
        console.error(`[CRON] Job ${job.id} failed: ${errorMessage}`);
      }

      if (success) {
        await prisma.backgroundJob.update({
          where: { id: job.id },
          data: { status: 'resolved', updatedAt: new Date() }
        });
      } else {
        const isDead = job.attempts >= job.maxAttempts;
        await prisma.backgroundJob.update({
          where: { id: job.id },
          data: { 
            status: isDead ? 'dead_letter' : 'retrying', 
            error: errorMessage,
            nextRetryAt: isDead ? null : new Date(Date.now() + 60000 * job.attempts),
            updatedAt: new Date()
          }
        });
        
        if (isDead) {
           await prisma.deadLetterJob.create({
               data: {
                   jobId: job.id,
                   sourceModule: job.jobType,
                   failureReason: errorMessage,
                   firstFailedAt: job.createdAt,
                   lastFailedAt: new Date(),
                   replayEligible: true
               }
           });
        }
      }
    }

    return NextResponse.json({ status: "success", message: "Cron executed successfully", processedJobs: pendingJobs.length, processedSchedules: dueSchedules.length });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

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
