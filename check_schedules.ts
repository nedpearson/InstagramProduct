import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pendingPast = await prisma.schedule.count({ where: { status: 'pending', scheduledFor: { lte: new Date() } } });
  const pendingFuture = await prisma.schedule.count({ where: { status: 'pending', scheduledFor: { gt: new Date() } } });
  const published = await prisma.schedule.count({ where: { status: 'published' } });
  
  console.log('Schedules Status:', { pendingPast, pendingFuture, published });

  const firstPending = await prisma.schedule.findFirst({
    where: { status: 'pending' },
    orderBy: { scheduledFor: 'asc' },
    include: { variant: { include: { asset: true } } }
  });
  console.log('First Pending Schedule:', JSON.stringify(firstPending, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
