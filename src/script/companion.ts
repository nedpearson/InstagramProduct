import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

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
      
      const pendingJobs = await prisma.backgroundJob.findMany({
        where: { status: 'pending', runAt: { lte: new Date() } },
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
  console.log('[COMPANION] Pretending to generate content via LLM API...');
  // In a real system, you'd call OpenAI / Anthropic here.
  // For the skeleton, we just resolve.
  await new Promise(r => setTimeout(r, 2000));
}

runCompanion().catch(console.error);
