import { prisma } from '@/lib/prisma';
import EntityDrilldown from '@/components/EntityDrilldown';
import { notFound } from 'next/navigation';

export default async function FunnelDrilldownPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await prisma.monetizationFunnel.findUnique({
    where: { id }
  });

  if (!data) return notFound();

  return <EntityDrilldown entityType="Monetization Funnel" entityId={id} data={data} backUrl="/revenue" />;
}
