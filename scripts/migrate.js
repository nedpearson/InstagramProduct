/**
 * migrate.js — Idempotent schema migration script
 * Run: node scripts/migrate.js
 * 
 * Applies any columns added to Prisma schema that weren't in the original
 * database. Safe to run multiple times.
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ log: ['error'] });

async function run() {
  console.log('[migrate] Connecting to database...');

  try {
    // Add BillingEvent.stripeEventId (idempotency for webhooks)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "BillingEvent"
      ADD COLUMN IF NOT EXISTS "stripeEventId" TEXT;
    `);
    console.log('[migrate] BillingEvent.stripeEventId: OK');

    // Add unique index for stripeEventId (if not already exists)
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes
          WHERE tablename = 'BillingEvent' AND indexname = 'BillingEvent_stripeEventId_key'
        ) THEN
          CREATE UNIQUE INDEX "BillingEvent_stripeEventId_key"
          ON "BillingEvent" ("stripeEventId")
          WHERE "stripeEventId" IS NOT NULL;
        END IF;
      END $$;
    `);
    console.log('[migrate] BillingEvent.stripeEventId unique index: OK');

    // Add BillingEvent.status
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "BillingEvent"
      ADD COLUMN IF NOT EXISTS "status" TEXT;
    `);
    console.log('[migrate] BillingEvent.status: OK');

    // Add Subscription.cancelledAt if missing
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Subscription"
      ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);
    `);
    console.log('[migrate] Subscription.cancelledAt: OK');

    // Add Subscription.cancelAtPeriodEnd if missing  
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Subscription"
      ADD COLUMN IF NOT EXISTS "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('[migrate] Subscription.cancelAtPeriodEnd: OK');

    // Add User.hashedPassword if missing (new auth system)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "hashedPassword" TEXT;
    `);
    console.log('[migrate] User.hashedPassword: OK');

    // Verify billing event works
    const count = await prisma.billingEvent.count();
    console.log(`[migrate] BillingEvent count: ${count}`);

    // Test subscription query (the one that was crashing)
    const sub = await prisma.subscription.findFirst({
      include: { addOns: true, discounts: true }
    });
    console.log(`[migrate] Subscription check: ${sub ? sub.planId : 'no subscription (will auto-provision)'}`);

    console.log('[migrate] ✅ All migrations complete.');
  } catch (err) {
    console.error('[migrate] ❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
