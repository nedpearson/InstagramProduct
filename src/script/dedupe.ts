import { prisma } from '../lib/prisma';

async function dedupe() {
  const assets = await prisma.contentAsset.findMany();
  const exactGroups = {} as any;
  for (const a of assets) {
    const key = a.campaignId + '|' + a.title;
    if (!exactGroups[key]) exactGroups[key] = [];
    exactGroups[key].push(a);
  }
  let deletedAssets = 0;
  for (const [k, group] of Object.entries(exactGroups) as any) {
    if (group.length > 1) {
      const toDelete = group.slice(1);
      for(const d of toDelete) {
        await prisma.contentAsset.delete({ where: { id: d.id } });
        deletedAssets++;
      }
    }
  }
  console.log('Deleted duplicate assets:', deletedAssets);
  
  const scheds = await prisma.schedule.findMany({ include: { variant: { include: { asset: true } } }});
  console.log('Remaining schedules:', scheds.length);
}

dedupe().catch(console.error);
