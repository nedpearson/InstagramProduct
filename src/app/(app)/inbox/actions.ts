'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function markResolved(deadLetterId: string, jobId: string) {
  await prisma.$transaction([
    prisma.backgroundJob.update({
      where: { id: jobId },
      data: { status: 'resolved' }
    }),
    prisma.deadLetterJob.delete({
      where: { id: deadLetterId }
    })
  ]);
  revalidatePath('/inbox');
}

export async function replayJob(deadLetterId: string, jobId: string) {
  // Reset the job's status to pending and delete the DLQ entry
  await prisma.$transaction([
    prisma.backgroundJob.update({
      where: { id: jobId },
      data: { 
        status: 'pending', 
        attempts: 0,
        error: null,
        nextRetryAt: new Date()
      }
    }),
    prisma.deadLetterJob.delete({
      where: { id: deadLetterId }
    })
  ]);
  revalidatePath('/inbox');
}
