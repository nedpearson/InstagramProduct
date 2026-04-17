import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Scanning database for active records...');
  
  try {
    // Delete all records in order of dependencies
    await prisma.agentActivity.deleteMany({});
    await prisma.lead.deleteMany({});
    await prisma.dmEvent.deleteMany({});
    await prisma.dmSequence.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.analyticsSnapshot.deleteMany({});
    await prisma.publishedPost.deleteMany({});
    await prisma.schedule.deleteMany({});
    await prisma.assetVariant.deleteMany({});
    await prisma.contentAsset.deleteMany({});
    await prisma.campaign.deleteMany({});
    await prisma.competitorMetric.deleteMany({});
    await prisma.competitorPositioning.deleteMany({});
    await prisma.competitorSnapshot.deleteMany({});
    await prisma.competitor.deleteMany({});
    await prisma.strategySection.deleteMany({});
    await prisma.strategyReport.deleteMany({});
    await prisma.scoreComponentEntity.deleteMany({});
    await prisma.opportunityScore.deleteMany({});
    await prisma.qAIssue.deleteMany({});
    await prisma.qAReview.deleteMany({});
    await prisma.workflowError.deleteMany({});
    await prisma.workflowRun.deleteMany({});
    await prisma.evidenceReference.deleteMany({});
    await prisma.trendSignal.deleteMany({});
    await prisma.strategicJobQueue.deleteMany({});
    await prisma.productBrief.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.workspace.deleteMany({});
    
    // Core users
    await prisma.user.deleteMany({});

    console.log('✨ Database is now crystal clear and clean.');
  } catch (e: any) {
    console.error('Failed to clean database:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
