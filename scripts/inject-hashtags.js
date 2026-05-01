const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const HASHTAG_STACKS = {
  automation:  ['#instagramautomation', '#aiautomation', '#marketingautomation', '#socialmediaai', '#contentautomation', '#instaflow', '#automationtools', '#makemoneyonline', '#passiveincome', '#sidehustle'],
  ai:          ['#artificialintelligence', '#aitools', '#chatgpt', '#aibusiness', '#techentrepreneur', '#futureofwork', '#aimarketing', '#digitalnomad', '#instaflow', '#airevolution'],
  income:      ['#makemoneyonline', '#passiveincomeideas', '#financialfreedom', '#digitalmarketing', '#onlinebusiness', '#entrepreneurmindset', '#instaflow', '#saas', '#growthhacking', '#10kmonth'],
  course:      ['#onlinecourses', '#digitalproducts', '#infopreneur', '#coursecreator', '#elearning', '#teachonline', '#passiveincome', '#instaflow', '#knowledgecommerce', '#digitalentrepreneur'],
  growth:      ['#instagramgrowth', '#instagramtips', '#socialmediagrowth', '#growthmarketing', '#organicgrowth', '#contentstrategy', '#reelstips', '#instaflow', '#socialmediatips', '#engagementtips'],
  default:     ['#instaflow', '#aiautomation', '#passiveincome', '#makemoneyonline', '#instagramgrowth', '#digitalmarketing', '#entrepreneurlife', '#sidehustle', '#onlinebusiness', '#aitools']
};

function selectHashtags(text) {
  const t = text.toLowerCase();
  let stack = HASHTAG_STACKS.default;
  if (t.includes('automat')) stack = HASHTAG_STACKS.automation;
  else if (t.includes('ai') || t.includes('artificial')) stack = HASHTAG_STACKS.ai;
  else if (t.includes('income') || t.includes('$') || t.includes('funnel') || t.includes('revenue')) stack = HASHTAG_STACKS.income;
  else if (t.includes('course') || t.includes('product') || t.includes('guide')) stack = HASHTAG_STACKS.course;
  else if (t.includes('grow') || t.includes('followers') || t.includes('reel')) stack = HASHTAG_STACKS.growth;
  const shuffled = [...stack].sort(() => 0.5 - Math.random());
  return '\n\n' + shuffled.slice(0, 7).join(' ');
}

async function run() {
  const assets = await prisma.contentAsset.findMany({
    where: { assetType: { in: ['caption', 'reel'] } }
  });

  let count = 0;
  for (const asset of assets) {
    if (asset.title?.startsWith('Auto-Reply')) continue;
    if (asset.notes?.includes('#instaflow')) continue; // already has hashtags

    const hashtags = selectHashtags((asset.title || '') + ' ' + (asset.notes || ''));
    await prisma.contentAsset.update({
      where: { id: asset.id },
      data: { notes: (asset.notes || '').trimEnd() + hashtags }
    });
    count++;
  }

  console.log(`✅ Injected hashtags into ${count} posts!`);
  await prisma.$disconnect();
}

run().catch(console.error);
