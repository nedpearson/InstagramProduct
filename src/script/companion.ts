import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function runCompanion() {
  console.log('[COMPANION] Starting local automation companion...');
  
  setInterval(async () => {
    try {
      console.log(`[COMPANION] Checking for pending background jobs... (${new Date().toISOString()})`);
      
      const pendingJobs = await prisma.backgroundJob.findMany({
        where: { status: 'queued', runAt: { lte: new Date() } },
        take: 5
      });

      for (const job of pendingJobs) {
        console.log(`[COMPANION] Processing job: ${job.id} type: ${job.jobType}`);
        
        // Mark as processing
        await prisma.backgroundJob.update({
          where: { id: job.id },
          data: { status: 'processing', attempts: { increment: 1 } }
        });

        let success = true;
        let errorMessage = '';

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
        }

        if (success) {
          await prisma.backgroundJob.update({
            where: { id: job.id },
            data: { status: 'completed', updatedAt: new Date() }
          });
          console.log(`[COMPANION] Job ${job.id} completed successfully.`);
        } else {
          await prisma.backgroundJob.update({
            where: { id: job.id },
            data: { 
              status: job.attempts >= job.maxAttempts ? 'failed' : 'queued', 
              error: errorMessage,
              updatedAt: new Date()
            }
          });
          console.error(`[COMPANION] Job ${job.id} failed: ${errorMessage}`);
          if (job.attempts >= job.maxAttempts) {
             // Create a ReviewTask for manual review of failed job
             await prisma.reviewTask.create({
                data: {
                   entityType: 'failed_job',
                   entityId: job.id,
                   reason: errorMessage
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
