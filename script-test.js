const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const schedules = await prisma.schedule.findMany({ take: 5, orderBy: { scheduledFor: 'desc' } });
  console.log('Schedules:', schedules);
  const jobs = await prisma.backgroundJob.findMany({ where: { jobType: 'publish_content' }, take: 5, orderBy: { createdAt: 'desc' } });
  console.log('Publish Jobs:', jobs);
}
main().finally(() => prisma.$disconnect());
