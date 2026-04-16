import { prisma } from '@/lib/prisma';
import EntityDrilldown from '@/components/EntityDrilldown';
import { notFound } from 'next/navigation';

export default async function CompetitorDrilldownPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await prisma.competitor.findUnique({
    where: { id },
    include: { snapshots: true }
  });

  if (!data) return notFound();

  return <EntityDrilldown entityType="Competitor Target" entityId={id} data={data} backUrl="/competitors" />;
}
