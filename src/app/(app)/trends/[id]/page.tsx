import { prisma } from '@/lib/prisma';
import EntityDrilldown from '@/components/EntityDrilldown';
import { notFound } from 'next/navigation';

export default async function TrendDrilldownPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await prisma.trendSignal.findUnique({
    where: { id }
  });

  if (!data) return notFound();

  return <EntityDrilldown entityType="Trend Signal" entityId={id} data={data} backUrl="/trends" />;
}
