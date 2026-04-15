const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scheduleRemaining() {
  // Get all still-approved assets (not yet scheduled)
  const assets = await prisma.contentAsset.findMany({
    where: { status: 'approved' },
    include: { variants: { take: 1 } },
    orderBy: { createdAt: 'asc' }
  });

  console.log('Found remaining approved assets:', assets.length);

  // Find last scheduled date so we continue from there
  const lastSchedule = await prisma.schedule.findFirst({
    orderBy: { scheduledFor: 'desc' }
  });

  let base = new Date();
  if (lastSchedule) {
    base = new Date(lastSchedule.scheduledFor);
    base.setDate(base.getDate() + 1); // Day after last scheduled
  } else {
    base.setDate(base.getDate() + 1);
  }
  base.setHours(9, 0, 0, 0);

  let count = 0;
  for (const asset of assets) {
    if (!asset.variants.length) {
      console.log('Skipping (no variants):', asset.title);
      continue;
    }
    const variant = asset.variants[0];
    const scheduledFor = new Date(base.getTime() + count * 24 * 60 * 60 * 1000);

    await prisma.schedule.create({
      data: { variantId: variant.id, scheduledFor, status: 'pending' }
    });
    await prisma.contentAsset.update({
      where: { id: asset.id },
      data: { status: 'scheduled' }
    });

    console.log(`Scheduled [${count + 1}]: "${asset.title}" -> ${scheduledFor.toDateString()} 9am`);
    count++;
  }

  const total = await prisma.schedule.count();
  console.log('Done. New posts scheduled:', count, '| Total on calendar:', total);
  await prisma.$disconnect();
}

scheduleRemaining().catch(e => { console.error(e); process.exit(1); });
