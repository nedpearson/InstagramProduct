const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// High-performing hashtag sets by content type
const HASHTAG_SETS = {
  caption: [
    '#instagramgrowth #instagramtips #instagramstrategy #contentcreator #socialmediamarketing #growyourbusiness #onlinecoach #coachingbusiness #instagramcoach #digitalmarketing #entrepreneurmindset #buildyourbrand #socialmediatips #businessgrowth #contentmarketing #growyouraudience #instagrammarketing #onlinebusiness #coachlife #clientattraction',
    '#instagramforbusiness #socialmediastrategy #contentcreation #coachinglife #businesscoach #fempreneur #onlineentrepreneur #marketingtips #growyourinstagram #instagramtips2024 #contentwriter #brandbuilding #socialmediagrowth #coachingonline #visibilitycoach #instagramalgorithm #reachmoreclients #scaleyourbusiness #thoughtleadership #audiencebuilding'
  ],
  reel_script: [
    '#instagramreels #reelsvideo #reelstips #growyourreels #viralreels #reelscreator #reelsmarketing #instagramreelstips #reelsforbusiness #contentcreatorlife #reelstrategy #makereels #instagramgrowth #instagramtips #coachingbusiness #onlinecoach #socialmediatips #contentcreation #digitalcreator #reelsinspiration',
    '#reels #instareels #reelsviral #reelscontent #businessreels #coachreels #instagramreel #viralcontent #reelstips2024 #contentmarketing #videomarketing #socialvideo #reelscommunity #instagramvideos #growthhack #audiencegrowth #reachmorecustomers #marketingreels #creatoreconomy #reelstrategy'
  ],
  dm_sequence: [
    '#instagramdms #dmstrategy #instagramsales #closingclients #instagrammarketing #salesconversation #dmscript #socialsellingcoach #instagrambusiness #coachingbusiness #leadgeneration #clientconversion #instagramleads #dmautomation #conversationalmarketing #onlinesales #instagramcoach #clientattraction #salessupport #instagrammessaging',
  ],
  bio_template: [
    '#instagrambio #instagramprofile #profileoptimization #instagramtips #instagrambranding #instagramcoach #biowriting #instagrammarketing #digitalbranding #onlinepresence #instagramgrowth #profiletips #socialmediacoach #brandidentity #instagramstrategy #biotemplate #instagramhelp #growyourbusiness #socialmediamarketing #instagramtips2024',
  ]
};

const AUTOMATION_RULES = [
  {
    name: 'Auto-Reply: Link in Bio Trigger',
    trigger: 'dm_keyword',
    triggerValue: 'LINK,link,link in bio,where can i find,how do i get',
    action: 'send_dm',
    actionValue: 'Hey! 👋 Thanks for reaching out! The link you\'re looking for is in my bio — here it is directly: {{LINK_IN_BIO}}. Let me know if you have any questions — I\'m happy to help! 🙏',
    isActive: true,
  },
  {
    name: 'Auto-Reply: Pricing Trigger',
    trigger: 'dm_keyword',
    triggerValue: 'price,pricing,how much,cost,investment,afford',
    action: 'send_dm',
    actionValue: 'Great question! 💰 Pricing varies based on your specific situation and goals. The best next step is a quick 15-min call so I can understand where you\'re at and share options that make sense for you. Want to grab one? Here\'s my calendar: {{BOOKING_LINK}} — totally free, no pressure!',
    isActive: true,
  },
  {
    name: 'Auto-Reply: GROW Keyword',
    trigger: 'dm_keyword',
    triggerValue: 'GROW,grow,growth,strategy',
    action: 'send_dm',
    actionValue: 'I love that! 🚀 Here\'s my free Instagram Growth Guide — it\'s the exact system I used to go from 800 to 10k followers: {{FREEBIE_LINK}}\n\nOnce you\'ve had a chance to look through it, let me know what stands out — happy to answer any questions!',
    isActive: true,
  },
  {
    name: 'Auto-Reply: SCRIPT Keyword',
    trigger: 'dm_keyword',
    triggerValue: 'SCRIPT,script,dm script,message',
    action: 'send_dm',
    actionValue: 'Here\'s your DM Sales Script! 📝\n\nMessage 1: Specific compliment on their content\nMessage 2: Free value (tip, resource, connection)\nMessage 3: "What\'s your biggest challenge right now?"\nMessage 4: Reflect + bridge ("That\'s exactly what I help with...")\nMessage 5: Book it ("I have 2 spots this week — here\'s my calendar")\n\nThe key: Be human. Be specific. Add value first. 🙏\n\nWant the full expanded version with word-for-word scripts? Reply YES!',
    isActive: true,
  },
  {
    name: 'Auto-Reply: CONVERT Keyword',
    trigger: 'dm_keyword',
    triggerValue: 'CONVERT,convert,conversion,cta,call to action',
    action: 'send_dm',
    actionValue: 'Here\'s my non-salesy CTA formula! 🎯\n\n3 CTA types that work:\n\n1. RESULT CTA: "Drop a ✋ if you want X. DM me Y and I\'ll send you Z."\n2. QUESTION CTA: "What\'s your biggest struggle with X? Tell me below."\n3. SAVE CTA: "Save this for when you\'re ready to tackle X."\n\nThe rule: Always tell them exactly what to do AND why it benefits them.\n\nWant me to write 5 custom CTAs for YOUR niche? Reply with your niche below! 👇',
    isActive: true,
  }
];

async function seedRulesAndHashtags() {
  console.log('🚀 Seeding automation rules and hashtags...\n');

  // 1. Seed automation rules
  const workspace = await prisma.workspace.findFirst();
  if (!workspace) { console.error('No workspace found'); process.exit(1); }

  let rulesCreated = 0;
  for (const rule of AUTOMATION_RULES) {
    const config = JSON.stringify({
      name: rule.name,
      trigger: rule.trigger,
      triggerValue: rule.triggerValue,
      action: rule.action,
      actionValue: rule.actionValue,
    });
    const existing = await prisma.automationRule.findFirst({
      where: { workspaceId: workspace.id, ruleConfig: { contains: rule.name } }
    });
    if (!existing) {
      await prisma.automationRule.create({
        data: {
          workspaceId: workspace.id,
          ruleType: rule.trigger,
          ruleConfig: config,
          isActive: rule.isActive,
        }
      });
      console.log(`✅ Rule: "${rule.name}"`);
      rulesCreated++;
    } else {
      console.log(`⏭️  Skipped (exists): "${rule.name}"`);
    }
  }


  // 2. Add hashtags to all asset variants
  const variants = await prisma.assetVariant.findMany({
    include: { asset: { select: { assetType: true } } }
  });

  let updated = 0;
  for (const v of variants) {
    const type = v.asset.assetType;
    const hashtagOptions = HASHTAG_SETS[type] || HASHTAG_SETS.caption;
    const hashtags = hashtagOptions[Math.floor(Math.random() * hashtagOptions.length)];
    
    // Only add if body doesn't already have hashtags
    if (v.body && !v.body.includes('#')) {
      await prisma.assetVariant.update({
        where: { id: v.id },
        data: { body: v.body + '\n\n' + hashtags }
      });
      updated++;
    }
  }

  const totalRules = await prisma.automationRule.count({ where: { isActive: true } });
  const totalVariants = await prisma.assetVariant.count();

  console.log('\n═══════════════════════════════════════════════════');
  console.log('🎉 AUTOMATION SETUP COMPLETE');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Rules created:     ${rulesCreated}`);
  console.log(`  Active rules:      ${totalRules}`);
  console.log(`  Variants updated:  ${updated} (hashtags added)`);
  console.log(`  Total variants:    ${totalVariants}`);
  console.log('═══════════════════════════════════════════════════\n');

  await prisma.$disconnect();
}

seedRulesAndHashtags().catch(e => { console.error('Error:', e.message); process.exit(1); });
