const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    const sub = await prisma.subscription.findFirst({ include: { addOns: true, discounts: true, billingEvents: { take: 1 } } });
    console.log('Subscription:', JSON.stringify(sub ? { id: sub.id, planId: sub.planId, status: sub.status } : null));
    
    const eventCount = await prisma.billingEvent.count();
    console.log('BillingEvents:', eventCount);

    const addOnCount = await prisma.addOn.count();
    console.log('AddOns:', addOnCount);

    // Test if stripeEventId column exists
    const e = await prisma.billingEvent.findFirst();
    console.log('BillingEvent sample:', JSON.stringify(e));
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
