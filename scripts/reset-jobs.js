const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const c = await prisma.campaign.findFirst();
  if (c) {
    await prisma.campaign.update({
      where: { id: c.id },
      data: { status: 'active' }
    });
  }

  const updated = await prisma.backgroundJob.updateMany({
    where: { jobType: 'generate_content' },
    data: { status: 'pending', attempts: 0, nextRetryAt: null, runAt: new Date() }
  });
  console.log(`Reset ${updated.count} jobs to pending!`);

  await prisma.$disconnect();
}
run();
