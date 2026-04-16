import { prisma } from '@/lib/prisma';
import EntityDrilldown from '@/components/EntityDrilldown';
import { notFound } from 'next/navigation';

export default async function TrendDrilldownPage({ params }: { params: { id: string } }) {
  const data = await prisma.trendSignal.findUnique({
    where: { id: params.id }
  });

  if (!data) return notFound();

  return <EntityDrilldown entityType="Trend Signal" entityId={params.id} data={data} backUrl="/trends" />;
}
