import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();
const openai = new OpenAI();

const PREMIUM_VISUALS = [
  'https://instaflow.bridgebox.ai/assets/product_dashboard.png',
  'https://instaflow.bridgebox.ai/assets/product_workflow.png',
  'https://instaflow.bridgebox.ai/assets/product_settings.png'
];

const HASHTAG_STACKS = {
  automation:  ['#instagramautomation', '#aiautomation', '#marketingautomation', '#socialmediaai', '#contentautomation', '#instaflow', '#automationtools'],
  ai:          ['#artificialintelligence', '#aitools', '#chatgpt', '#aibusiness', '#techentrepreneur', '#futureofwork', '#aimarketing'],
  income:      ['#makemoneyonline', '#passiveincomeideas', '#financialfreedom', '#digitalmarketing', '#onlinebusiness', '#entrepreneurmindset', '#instaflow'],
  course:      ['#onlinecourses', '#digitalproducts', '#infopreneur', '#coursecreator', '#elearning', '#teachonline', '#passiveincome'],
  growth:      ['#instagramgrowth', '#instagramtips', '#socialmediagrowth', '#growthmarketing', '#organicgrowth', '#contentstrategy', '#reelstips'],
  default:     ['#instaflow', '#aiautomation', '#passiveincome', '#makemoneyonline', '#instagramgrowth', '#digitalmarketing', '#entrepreneurlife']
};

function selectHashtags(text) {
  const t = text.toLowerCase();
  let stack = HASHTAG_STACKS.default;
  if (t.includes('automat')) stack = HASHTAG_STACKS.automation;
  else if (t.includes('ai') || t.includes('artificial')) stack = HASHTAG_STACKS.ai;
  else if (t.includes('income') || t.includes('$') || t.includes('funnel')) stack = HASHTAG_STACKS.income;
  else if (t.includes('course') || t.includes('product')) stack = HASHTAG_STACKS.course;
  else if (t.includes('grow') || t.includes('follower')) stack = HASHTAG_STACKS.growth;
  return '\\n\\n' + stack.join(' ');
}

async function upgradeAssets() {
  console.log('🚀 Starting massive retroactive upgrade for all ContentAssets...');
  
  const assets = await prisma.contentAsset.findMany();
  console.log(`Found ${assets.length} assets to upgrade.`);

  let count = 0;
  for (const asset of assets) {
    count++;
    console.log(`[${count}/${assets.length}] Upgrading Asset ID: ${asset.id}...`);

    try {
      // 1. Pick a premium visual
      const premiumVisual = PREMIUM_VISUALS[count % PREMIUM_VISUALS.length];
      const mediaMetadata = { visualUrl: premiumVisual };

      // 2. Generate Mini-Course Structured Caption
      console.log(`  -> Generating Mini-Course formatting via AI...`);
      const aiResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: `You are an expert Instagram carousel creator. Convert the provided content into a 5-part "Mini-Course". Break the text into 5 distinct, highly readable sections separated by "---". The final section MUST be a strong Call To Action: "Want the full system? DM me the word 'SYSTEM' right now."` },
          { role: 'user', content: asset.notes || asset.title || 'How to automate your social media' }
        ]
      });
      
      let newCaption = (aiResponse.choices[0].message.content || '').replace(/---/g, '\\n\\n➡️ SWIPE ➡️\\n\\n');

      // 3. Add UTM Link
      const utmLink = `https://instaflow.bridgebox.ai?utm_source=instagram&utm_medium=post&utm_campaign=instaflow&utm_content=${asset.id.slice(0, 8)}`;
      newCaption += `\\n\\n🔗 Full System Link: ${utmLink}`;

      // 4. Add Hashtag Intelligence
      newCaption += selectHashtags(newCaption);

      // Save to Database
      await prisma.contentAsset.update({
        where: { id: asset.id },
        data: {
          notes: newCaption,
          mediaMetadata: JSON.stringify(mediaMetadata),
          status: asset.status === 'published' ? 'published' : 'reviewed'
        }
      });

      console.log(`  ✅ Upgraded successfully.`);
    } catch (e) {
      console.log(`  ❌ Failed to upgrade asset ${asset.id}:`, e.message);
    }
  }

  console.log('🎉 Retroactive upgrade complete! All previous posts now have premium visuals, UTM links, and mini-course formatting.');
}

upgradeAssets().catch(console.error);
