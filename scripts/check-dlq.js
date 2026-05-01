const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function run() {
  try {
    const c = await p.deadLetterJob.count();
    console.log('DLQ count:', c);
    const bj = await p.backgroundJob.count();
    console.log('BackgroundJob count:', bj);
    const q = await p.queue.findFirst().catch(() => null);
    console.log('Queue:', q);
  } catch(e) {
    console.error('ERROR:', e.message.slice(0, 200));
  } finally {
    await p.$disconnect();
  }
}
run();
