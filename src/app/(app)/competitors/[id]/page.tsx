import { prisma } from '@/lib/prisma';
import EntityDrilldown from '@/components/EntityDrilldown';
import { notFound } from 'next/navigation';

export default async function CompetitorDrilldownPage({ params }: { params: { id: string } }) {
  const data = await prisma.competitor.findUnique({
    where: { id: params.id },
    include: { observations: true }
  });

  if (!data) return notFound();

  return <EntityDrilldown entityType="Competitor Target" entityId={params.id} data={data} backUrl="/competitors" />;
}
