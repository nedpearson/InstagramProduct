import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI();

async function runCompanion() {
  console.log('[COMPANION] Starting local automation companion...');
  
  setInterval(async () => {
    try {
      // 1. Log heartbeat to watchdog
      await prisma.watchdogHeartbeat.upsert({
        where: { serviceName: 'companion' },
        update: { lastPingAt: new Date(), status: 'alive' },
        create: { serviceName: 'companion', status: 'alive' }
      });

      console.log(`[COMPANION] Worker Heartbeat OK. Checking for pending background jobs... (${new Date().toISOString()})`);
      
      const currentHour = new Date().getHours();
      // Peak Engagement Windows: 8 AM, 12 PM, 6 PM (18)
      const isPeakEngagement = [8, 12, 18].includes(currentHour);

      const pendingJobs = await prisma.backgroundJob.findMany({
        where: { 
          status: 'pending', 
          runAt: { lte: new Date() },
          ...(isPeakEngagement ? {} : { jobType: { not: 'publish_content' } }) 
        },
        take: 5
      });

      for (const job of pendingJobs) {
        console.log(`[COMPANION] Processing job: ${job.id} type: ${job.jobType}`);
        
        // Mark as processing
        await prisma.backgroundJob.update({
          where: { id: job.id },
          data: { status: 'running', attempts: { increment: 1 } }
        });

        let success = true;
        let errorMessage = '';
        let stackDetails = '';

        try {
          if (job.jobType === 'export_data') {
            await handleExportJob(job.payload);
          } else if (job.jobType === 'generate_content') {
            await handleGenerateJob(job.payload);
          } else if (job.jobType === 'publish_content') {
            await handlePublishJob(job.payload);
          } else {
            success = false;
            errorMessage = 'Unknown job type: ' + job.jobType;
          }
        } catch (e: any) {
          success = false;
          errorMessage = e.message || 'Unknown error';
          stackDetails = e.stack || '';
        }

        if (success) {
          await prisma.backgroundJob.update({
            where: { id: job.id },
            data: { status: 'resolved', updatedAt: new Date() }
          });
          console.log(`[COMPANION] Job ${job.id} completed successfully.`);
        } else {
          const isDead = job.attempts >= job.maxAttempts;
          
          await prisma.backgroundJob.update({
            where: { id: job.id },
            data: { 
              status: isDead ? 'dead_letter' : 'retrying', 
              error: errorMessage,
              nextRetryAt: isDead ? null : new Date(Date.now() + 60000 * job.attempts), // Exponential-ish backoff
              updatedAt: new Date()
            }
          });
          
          console.error(`[COMPANION] Job ${job.id} failed: ${errorMessage}`);
          
          if (isDead) {
             console.error(`[COMPANION] Job ${job.id} EXHAUSTED max attempts. Routing to DLQ.`);
             // Create Dead Letter Task
             await prisma.deadLetterJob.create({
                 data: {
                     jobId: job.id,
                     sourceModule: job.jobType,
                     failureReason: errorMessage,
                     stackTrace: stackDetails,
                     firstFailedAt: job.createdAt,
                     lastFailedAt: new Date(),
                     replayEligible: true
                 }
             });
             
             // Create a ReviewTask for manual operator interference
             await prisma.reviewTask.create({
                data: {
                   entityType: 'dead_letter',
                   entityId: job.id,
                   reason: `Fatal failure in module ${job.jobType}: ${errorMessage}`
                }
             });
          }
        }
      }
    } catch (err) {
      console.error('[COMPANION] Error in loop:', err);
    }
  }, 10000); // Check every 10 seconds
}

async function handleExportJob(payloadStr: string | null) {
  if (!payloadStr) throw new Error('Missing payload for export');
  const payload = JSON.parse(payloadStr);

  const assets = await prisma.contentAsset.findMany();
  const filePath = path.join(process.cwd(), `export-${Date.now()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(assets, null, 2));

  await prisma.export.update({
    where: { id: payload.exportId },
    data: { status: 'completed', filename: filePath }
  });
}

async function handleGenerateJob(payloadStr: string | null) {
  if (!payloadStr) throw new Error('Missing payload for generation');
  const payload = JSON.parse(payloadStr);

  console.log('[COMPANION] 🧠 Physically initiating OpenAI API loop...');

  let targetCampaignId = payload.campaignId;
  if (!targetCampaignId) {
    const defaultCampaign = await prisma.campaign.findFirst({ where: { status: 'active' }});
    targetCampaignId = defaultCampaign ? defaultCampaign.id : null;
  }

  if (!targetCampaignId) {
     console.log('[COMPANION] ⚠️ Generation skipped: No active Campaign target found.');
     return;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are the Instaflow Master Content Architect. You generate ultra-viral, scroll-stopping Instagram Reels hooks and caption layouts designed explicitly for monetization."
      },
      {
        role: "user",
        content: `Generate a viral Instagram Hook and Caption for a new post. Focus on the niche topic provided: "${payload.assetType || 'Automation and AI SaaS'}". 
        
CRITICAL RULE: You MUST append the following Call-To-Action (CTA) bridge physically at the end of the caption:
"Ready to build your autonomous machine? Link in bio to access the InstaFlow 2026 Pipeline: https://instaflow.bridgebox.ai"

Output EXACTLY in JSON format: { "hook": "...", "caption": "...", "format": "reel" } without markdown.`
      }
    ]
  });

  const responseText = completion.choices[0].message.content || '{}';
  const aiData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());

  await prisma.contentAsset.create({
    data: {
      campaignId: targetCampaignId,
      title: aiData.hook || 'Viral Asset',
      assetType: aiData.format || 'reel',
      status: 'reviewed', // Autonomously lock and load
      notes: aiData.caption || 'Generated by Instaflow Master AI'
    }
  });

  console.log('[COMPANION] ✅ OpenAI Generation successfully written to PostgreSQL.');
}

async function handlePublishJob(payloadStr: string | null) {
  if (!payloadStr) throw new Error('Missing payload for publish');
  const payload = JSON.parse(payloadStr);

  const asset = await prisma.contentAsset.findUnique({ where: { id: payload.assetId }});
  if (!asset) throw new Error('Asset not found');

  console.log(`[COMPANION] 📡 Connecting to Meta Graph API for Asset ${asset.id}...`);

  const token = process.env.META_ADS_ACCESS_TOKEN;
  if (!token) throw new Error('Missing META_ADS_ACCESS_TOKEN');

  // 1. Resolve IG Account ID from Facebook Page
  const pagesReq = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${token}`);
  const pagesData = await pagesReq.json();
  const igBusId = pagesData?.data?.[0]?.instagram_business_account?.id;

  if (!igBusId) throw new Error("Graph API physical failure: No Instagram Business Account linked to this Token's pages.");

  // 2. Upload Media Container sequence with 3x rapid recursion block natively
  let uploadData: any = null;
  let publishData: any = null;
  let attempts = 0;
  let lastError = null;

  console.log(`[COMPANION] Initializing Graph API upload protocol with zero-touch fault-tolerance layer...`);
  const physicalImageUrl = 'https://raw.githubusercontent.com/nedpearson/InstagramProduct/main/public/branding.png';

  while (attempts < 3) {
    try {
      attempts++;
      console.log(`[COMPANION] Attempt ${attempts}: Transmitting Media to ${igBusId}...`);
      const uploadReq = await fetch(`https://graph.facebook.com/v18.0/${igBusId}/media?caption=${encodeURIComponent(asset.notes || asset.title)}&image_url=${encodeURIComponent(physicalImageUrl)}&access_token=${token}`, { method: 'POST' });
      uploadData = await uploadReq.json();
      
      if (uploadData.error) throw new Error(`Meta Upload Rejection: ${JSON.stringify(uploadData.error)}`);
      
      console.log(`[COMPANION] Attempt ${attempts}: Forcing Container Publication: ${uploadData.id}...`);
      const publishReq = await fetch(`https://graph.facebook.com/v18.0/${igBusId}/media_publish?creation_id=${uploadData.id}&access_token=${token}`, { method: 'POST' });
      publishData = await publishReq.json();
      
      if (publishData.error) throw new Error(`Meta Publish Rejection: ${JSON.stringify(publishData.error)}`);
      
      break; // Success triggers escape from recursion
    } catch (e: any) {
      lastError = e;
      console.warn(`[COMPANION] ⚠️ Meta Graph Error on Attempt ${attempts}: ${e.message}. Retrying instantly...`);
      if (attempts >= 3) {
        console.error(`[COMPANION] 🚨 FATAL INSTAGRAM API DROP. Rerouting to manual fallback method.`);
        // Fallback Reroute Action
        await prisma.reviewTask.create({
          data: {
             entityType: 'instagram_rejection',
             entityId: asset.id,
             reason: `Graph API rejected upload 3 times. Manual override required via iOS App. Last Error: ${e.message}`
          }
        });
        throw new Error('Graph API sequence aborted after 3 retries.');
      }
      await new Promise(resolve => setTimeout(resolve, 3000)); // Sleep 3s before retry
    }
  }

  await prisma.contentAsset.update({
    where: { id: asset.id },
    data: { status: 'published' }
  });

  console.log(`[COMPANION] ✅ SUCCESS: Asset live on Instagram network. IG Post ID: ${publishData.id}`);
}

runCompanion().catch(console.error);
