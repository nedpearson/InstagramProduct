import { prisma } from '@/lib/prisma';
import EntityDrilldown from '@/components/EntityDrilldown';
import { notFound } from 'next/navigation';

export default async function AssetDrilldownPage({ params }: { params: { id: string } }) {
  const data = await prisma.contentAsset.findUnique({
    where: { id: params.id },
    include: { variants: true }
  });

  if (!data) return notFound();

  return <EntityDrilldown entityType="Content Asset" entityId={params.id} data={data} backUrl="/library" />;
}
