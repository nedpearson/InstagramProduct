import { prisma } from '@/lib/prisma';
import EntityDrilldown from '@/components/EntityDrilldown';
import { notFound } from 'next/navigation';

export default async function FunnelDrilldownPage({ params }: { params: { id: string } }) {
  const data = await prisma.monetizationFunnel.findUnique({
    where: { id: params.id }
  });

  if (!data) return notFound();

  return <EntityDrilldown entityType="Monetization Funnel" entityId={params.id} data={data} backUrl="/revenue" />;
}
