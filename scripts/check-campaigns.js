const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const campaigns = await prisma.campaign.findMany();
  console.log('Campaigns:', campaigns.map(c => c.id));
  
  const jobs = await prisma.backgroundJob.findMany({ where: { jobType: 'generate_content' }});
  console.log('Payloads:', jobs.map(j => j.payload));

  await prisma.$disconnect();
}
run();
