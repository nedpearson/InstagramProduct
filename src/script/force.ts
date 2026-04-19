import { startAutonomousOrchestration } from '../lib/orchestrator';

async function main() {
  const briefId = 'd1d47402-11ae-41ea-b396-7b11728a71ca';
  console.log('Forcing start of orchestration for brief:', briefId);
  await startAutonomousOrchestration(briefId);
  console.log('Orchestration triggered successfully!');
}

main().catch(console.error);
