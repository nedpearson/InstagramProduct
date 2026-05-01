const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const jobs = await prisma.backgroundJob.findMany({
    where: { jobType: 'publish_content' },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log('Recent publish_content jobs:', JSON.stringify(jobs, null, 2));
  
  const schedules = await prisma.schedule.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('Recent schedules:', JSON.stringify(schedules, null, 2));
  
  const tasks = await prisma.reviewTask.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('Recent review tasks:', JSON.stringify(tasks, null, 2));

  const assets = await prisma.contentAsset.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('Recent assets:', JSON.stringify(assets, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
