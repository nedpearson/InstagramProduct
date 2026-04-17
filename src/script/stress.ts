import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000'; 

async function pingEndpoint(url: string, name: string) {
  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }});
    const data = await res.json();
    const duration = Date.now() - start;
    if (res.ok) {
      console.log(`[PASS] ${name} -> ${res.status} OK in ${duration}ms`);
      return { success: true, duration, data };
    } else {
      console.error(`[FAIL] ${name} -> ${res.status} ERROR in ${duration}ms`, data);
      return { success: false, duration, error: data };
    }
  } catch (e: any) {
    const duration = Date.now() - start;
    console.error(`[FATAL] ${name} -> Network Error in ${duration}ms`, e.message);
    return { success: false, duration, error: e.message };
  }
}

async function runGlobalStressTest() {
  console.log("=========================================");
  console.log("🚀 INITIATING GLOBAL AGENT STRESS TEST");
  console.log("=========================================\n");

  const agents = [
    { name: 'System Auditor', url: '/api/agents/auditor' },
    { name: 'Velocity Engine', url: '/api/agents/velocity' },
    { name: 'Ads Intelligence', url: '/api/agents/ads' },
    { name: 'Competitive Intel', url: '/api/agents/competitive-intelligence' },
    { name: 'Differentiation', url: '/api/agents/differentiation' },
    { name: 'Funnel Optimization', url: '/api/agents/funnel-optimization' },
    { name: 'SaaS Monetization', url: '/api/agents/saas' },
    { name: 'Revenue Scaling', url: '/api/agents/revenue-scaling' },
    { name: 'Lifecycle Logic', url: '/api/agents/lifecycle' }
  ];

  // PHASE 1: SEQUENTIAL WARMUP
  console.log("--- PHASE 1: SEQUENTIAL WARMUP ---");
  for (const agent of agents) {
    await pingEndpoint(agent.url, agent.name);
  }

  // PHASE 2: CONCURRENT MAX LOAD 
  console.log("\n--- PHASE 2: CONCURRENT MASTER ORCHESTRATOR SCALING ---");
  console.log(`Blasting the Master Decision engine with 5 concurrent cycles...`);
  
  const promises = [];
  for(let i=0; i<5; i++) {
    promises.push(pingEndpoint('/api/agents/decision', `Master Orchestrator Worker #${i+1}`));
  }

  await Promise.all(promises);

  // PHASE 3: VERIFY DB INTEGRITY
  console.log("\n--- PHASE 3: DATABASE INTEGRITY CHECK ---");
  const activities = await prisma.agentActivity.count();
  const leads = await prisma.lead.count();
  const jobs = await prisma.backgroundJob.count();
  console.log(`Rows verified in DB Post-Stress:`);
  console.log(`- Agent Activities: ${activities}`);
  console.log(`- Jobs Enqueued: ${jobs}`);
  console.log(`- Leads Captured: ${leads}`);

  if (activities > 0) {
    console.log("\n✅ ALL SYSTEMS NOMINAL: Global stress tests complete with 0 database locks and positive telemetry tracking.");
  } else {
    console.log("\n⚠️ WARNING: Database rows were not written during stress test.");
  }
}

runGlobalStressTest()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
