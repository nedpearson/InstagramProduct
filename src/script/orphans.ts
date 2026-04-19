import { prisma } from '../lib/prisma';

async function checkOrphans() {
  const scheds = await prisma.schedule.findMany({ include: { variant: { include: { asset: true } } }});
  let orphaned = 0;
  for (const s of scheds) {
    if (!s.variant || !s.variant.asset) {
      orphaned++;
      await prisma.schedule.delete({ where: { id: s.id } });
    }
  }
  
  const variants = await prisma.assetVariant.findMany({ include: { asset: true } });
  for (const v of variants) {
    if (!v.asset) {
      await prisma.assetVariant.delete({ where: { id: v.id } });
      console.log('Deleted orphaned variant');
    }
  }
  
  console.log(`Deleted ${orphaned} orphaned schedules`);
  
  const finalScheds = await prisma.schedule.findMany();
  console.log('True Active Schedules:', finalScheds.length);
}

checkOrphans().catch(console.error);
