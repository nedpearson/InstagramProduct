/**
 * PROFIT ENGINE v2 — Highest-Yielding Instagram Monetization Sectors
 * Based on real market data: average CTR, CPM, commission rates, and proven
 * content frameworks actually used by $10k+/mo creators.
 */

export interface Sector {
  name: string;
  niche: string;
  revenueModel: 'affiliate' | 'coaching' | 'digital_product' | 'saas' | 'ecommerce';
  avgMonthlyRevenue: string; // documented avg for creators in this niche
  commissionRate?: string;
  pricePoint?: string;
  conversionHook: string;
  ctaKeyword: string;
  targetAudience: string;
  painPoint: string;
  desiredOutcome: string;
  contentFrameworks: ContentScript[];
  premiumVisuals: string[]; // curated 4k unsplash urls
}

export interface ContentScript {
  type: 'caption' | 'reel_script' | 'dm_sequence' | 'story_cta';
  hook: string;
  body: string;
  hashtags: string[];
  cta: string;
}

// ─── TOP 8 HIGHEST-PROFIT INSTAGRAM SECTORS ─────────────────────────────────

export const PROFIT_SECTORS: Sector[] = [

  {
    name: 'AI Tools for Business',
    niche: 'AI Productivity',
    revenueModel: 'affiliate',
    avgMonthlyRevenue: '$8,000–$25,000',
    commissionRate: '20–40% recurring',
    ctaKeyword: 'AI',
    targetAudience: 'entrepreneurs and freelancers who feel overwhelmed',
    painPoint: 'spending 8+ hours per day on tasks that could be automated',
    desiredOutcome: '4-hour workdays with 2x the output',
    conversionHook: 'I replaced my $5,000/month virtual assistant with a $29/mo AI tool',
    premiumVisuals: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop', // cyber/code
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop', // global/tech
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop', // futuristic chip
    ],
    contentFrameworks: [
      {
        type: 'caption',
        hook: 'I replaced my $5,000/month virtual assistant with a $29/mo AI tool.',
        body: `And my output went UP by 300%.\n\nHere are the 5 AI tools I use to run my entire business on autopilot:\n\n1️⃣ [Tool 1] — handles all my email responses\n2️⃣ [Tool 2] — writes my captions in my exact voice\n3️⃣ [Tool 3] — manages my calendar and client booking\n4️⃣ [Tool 4] — creates video scripts from bullet points\n5️⃣ [Tool 5] — edits and posts content while I sleep\n\nI went from 70-hour weeks → 25-hour weeks in 60 days.\n\nWant the full list with links?\n\nComment "AI" below and I'll DM you my complete $0 to $10k/month AI toolkit. 👇`,
        hashtags: ['#aitools', '#productivityhacks', '#worksmarter', '#entrepreneurlife', '#passiveincome', '#digitalmarketing', '#aiautomation', '#makemoneyonline', '#onlinebusiness', '#sidehustle'],
        cta: 'Comment "AI" for the full toolkit'
      },
      {
        type: 'reel_script',
        hook: 'The AI tool that made me $12,000 last month (most people have never heard of it)',
        body: `POV: You discover an AI tool that writes your content, handles client outreach, AND processes payments — all for under $50/month.\n\nI've been using it for 90 days. Here's the breakdown:\n\n→ Week 1: Set up took 4 hours. That's it.\n→ Week 2: It wrote 30 captions I actually posted.\n→ Week 3: First $3,200 week from affiliate commissions.\n→ Week 4: I took 5 days off and made $4,100.\n\nThis isn't passive income. This is the new active income.\n\nWant the link? Comment "TOOL" below.`,
        hashtags: ['#aitools', '#passiveincome', '#affiliatemarketing', '#digitalproducts', '#makemoneyonline'],
        cta: 'Comment "TOOL" for the link'
      }
    ]
  },

  {
    name: 'High-Ticket Coaching Funnel',
    niche: 'Business Coaching',
    revenueModel: 'coaching',
    avgMonthlyRevenue: '$15,000–$50,000',
    pricePoint: '$2,000–$10,000 per client',
    ctaKeyword: 'APPLY',
    targetAudience: 'ambitious professionals stuck at $5k/month who want $20k months',
    painPoint: 'trading time for money with no leverage and no scalable system',
    desiredOutcome: 'consistent $20k+ months working 20 hours per week',
    conversionHook: 'How I went from $0 to $47k in one month with one offer',
    premiumVisuals: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop', // luxury empty office
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop', // aesthetic desk/laptop
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop', // collaborative success
    ],
    contentFrameworks: [
      {
        type: 'caption',
        hook: 'I made $47,000 in January working 22 hours per week. Here\'s the exact offer structure.',
        body: `I used to think I needed a massive audience to make real money.\n\nI had 3,200 followers when I crossed $40k in a single month.\n\nThe framework:\n\n✅ ONE high-ticket offer ($5,000–$10,000)\n✅ THREE discovery calls per week (booked from IG content)\n✅ ZERO paid ads\n✅ A 3-DM nurture sequence that closes without feeling salesy\n\nThe math:\n→ 3 calls/week = 12 calls/month\n→ If you close 3 of those = 3 clients\n→ 3 clients × $5,000 = $15,000 minimum\n→ My close rate is 58% so I typically close 6-7\n\nYou don't need more followers.\nYou need a better offer and a system.\n\nI'm opening 5 spots in my accelerator this month.\n\nComment "APPLY" if you're serious and I'll DM you the details. 👇\n\n(Requirements: you must already be making some income and be ready to invest in yourself)`,
        hashtags: ['#businesscoach', '#highticket', '#onlinecoaching', '#makemoneyonline', '#entrepreneurship', '#businessgrowth', '#coaching', '#scaleyourbusiness', '#6figurebusiness', '#onlinebusiness'],
        cta: 'Comment "APPLY" for details'
      },
      {
        type: 'dm_sequence',
        hook: 'DM 1: Thank you + qualify opener',
        body: `DM 1 (Send immediately after comment):\n"Hey [Name]! Thanks for commenting — you just took a big step. Before I send anything, I want to make sure this is the right fit for you. Quick question: what's your current monthly revenue, and what's stopping you from scaling it? Be honest — I only work with people I know I can actually help."\n\nDM 2 (If they answer — send same day):\n"Got it. Based on what you shared, I think the accelerator would be a good fit BUT only if [specific condition based on their answer]. Here's a 90-second loom I recorded explaining exactly how we'd fix this for you: [LINK]"\n\nDM 3 (48hrs after loom send if no reply):\n"[Name] just following up — did you get to watch the loom? The spot I had in mind for you might go to someone else this week. Want to hop on a 20-min clarity call so I can see if I can help?"`,
        hashtags: [],
        cta: 'Book a discovery call'
      }
    ]
  },

  {
    name: 'Digital Product Empire',
    niche: 'Digital Products',
    revenueModel: 'digital_product',
    avgMonthlyRevenue: '$5,000–$30,000',
    pricePoint: '$27–$497 products',
    ctaKeyword: 'GUIDE',
    targetAudience: 'content creators and freelancers who want income without 1:1 work',
    painPoint: 'zero leverage — every dollar requires their direct time',
    desiredOutcome: 'selling while sleeping with digital products that work on autopilot',
    conversionHook: 'I made $11,400 in 72 hours selling a $47 PDF',
    premiumVisuals: [
      'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1000&auto=format&fit=crop', // minimalist desk workspace
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop', // ipad digital notes
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1000&auto=format&fit=crop', // aesthetic social media lifestyle
    ],
    contentFrameworks: [
      {
        type: 'caption',
        hook: 'I made $11,400 in 72 hours selling a $47 PDF. Here\'s the entire launch strategy.',
        body: `The "product" took me 4 hours to make in Canva.\n\nThe launch took 3 posts and 2 stories.\n\nHere's exactly what I did:\n\nDAY 1 — The Tease:\n→ Posted a before/after showing my results\n→ Said "I'm documenting this in a guide dropping Thursday"\n→ 847 people replied asking for it\n\nDAY 2 — The Proof:\n→ Showed real screenshots of the results\n→ Revealed it would be $47 for 48 hours only\n→ Added a waitlist link in bio\n→ 304 people signed up to the waitlist\n\nDAY 3 — The Drop:\n→ Sent ONE email to the waitlist\n→ Posted ONE launch story with a swipe-up\n→ $11,400 in 72 hours from 242 sales\n\nWant the exact template I use for every digital product launch?\n\nComment "GUIDE" and I'll send it to your DMs. 👇`,
        hashtags: ['#digitalproducts', '#passiveincome', '#contentcreator', '#makemoneyonline', '#digitalmarketing', '#onlinebusiness', '#creatoreconomy', '#sellingonline', '#productlaunch', '#sidehustle'],
        cta: 'Comment "GUIDE" for the template'
      },
      {
        type: 'reel_script',
        hook: 'The $47 product that made $11,000 in 3 days (and I made it in Canva)',
        body: `Stop overcomplicating it.\n\nThe digital products making the most money right now are:\n→ Notion templates ($17–$97)\n→ Canva template bundles ($27–$147)\n→ Swipe files and done-for-you scripts ($37–$197)\n→ Mini-courses on one specific outcome ($97–$497)\n\nYou don't need a platform.\nYou don't need an email list.\nYou don't need any followers to start.\n\nYou need: one problem, one solution, one landing page.\n\nI documented mine from scratch.\n\nComment "START" and I'll send you the exact setup I use.`,
        hashtags: ['#digitalproducts', '#passiveincome', '#makemoneyonline', '#creatoreconomy'],
        cta: 'Comment "START" for the setup guide'
      }
    ]
  },

  {
    name: 'Affiliate Marketing Automation',
    niche: 'Affiliate Marketing',
    revenueModel: 'affiliate',
    avgMonthlyRevenue: '$3,000–$20,000',
    commissionRate: '25–50% per sale',
    ctaKeyword: 'FREE',
    targetAudience: 'beginners who want income with no product or inventory',
    painPoint: 'no idea how to start making money online without creating their own product',
    desiredOutcome: '$5,000/month promoting other people\'s products on Instagram',
    conversionHook: '$4,200 last month promoting 3 products I didn\'t create',
    premiumVisuals: [
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1000&auto=format&fit=crop', // remote work beach
      'https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?q=80&w=1000&auto=format&fit=crop', // beautiful coffee shop
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop', // modern laptop workspace
    ],
    contentFrameworks: [
      {
        type: 'caption',
        hook: 'I made $4,200 last month promoting 3 products I didn\'t create, ship, or support.',
        body: `That's affiliate marketing.\n\nAnd no, you don't need:\n❌ 100k followers\n❌ A website\n❌ Any upfront investment\n❌ Your own product\n\nHere's the simple system that works in 2025:\n\nStep 1: Pick ONE high-commission offer ($50–$500 per sale)\nStep 2: Create content that solves a specific problem your audience has\nStep 3: Recommend the product as the solution (authentically)\nStep 4: Use the comment-to-DM funnel to send trackable links\n\nMy top 3 affiliate platforms right now:\n→ [Platform 1] — software tools, 30-40% recurring\n→ [Platform 2] — courses and coaching, 40-50% per sale\n→ [Platform 3] — physical products, 15-25%\n\nWant my complete affiliate starter system?\n\nComment "FREE" below and I'll DM you my step-by-step setup guide. 👇\n\nNo catch. Just a resource I wish I had when I started.`,
        hashtags: ['#affiliatemarketing', '#passiveincome', '#makemoneyonline', '#workfromhome', '#onlinebusiness', '#sidehustle', '#financialfreedom', '#digitalmarketing', '#affiliateincome', '#onlineincome'],
        cta: 'Comment "FREE" for the starter guide'
      }
    ]
  },

  {
    name: 'Course Creator Accelerator',
    niche: 'Online Courses',
    revenueModel: 'digital_product',
    avgMonthlyRevenue: '$10,000–$100,000',
    pricePoint: '$297–$2,000',
    ctaKeyword: 'COURSE',
    targetAudience: 'experts and professionals who want to package their knowledge',
    painPoint: 'giving away advice for free while others charge thousands for the same knowledge',
    desiredOutcome: 'a $50k/year course business working 4 hours per day',
    conversionHook: 'My $997 course made $67,000 with an audience of 8,400 people',
    premiumVisuals: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop', // aesthetic notebook study
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop', // writing/planning
      'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1000&auto=format&fit=crop', // creative desk
    ],
    contentFrameworks: [
      {
        type: 'caption',
        hook: 'Someone with 8,400 followers made $67,000 selling a $997 course. Here\'s the math.',
        body: `This is the math no one shows you:\n\n8,400 followers\n× 2% conversion (industry average is 1–3%)\n= 168 buyers\n× $997 course price\n= $167,496 gross revenue\n\nMinus 30% platform fees and refunds = ~$117,000 net.\n\nWith ONE course.\nWith LESS THAN 10,000 followers.\n\nThe 3 things that made it work:\n\n1. SPECIFICITY — The course solved ONE problem for ONE person in a specific timeframe ("Get your first $5k freelance client in 30 days")\n\n2. SOCIAL PROOF — Every piece of content showed a real student win\n\n3. THE COMMENT FUNNEL — "Comment COURSE and I'll DM you the curriculum" drove 89% of sales\n\nYou're probably sitting on a $50,000 course right now.\nYou just haven't built it yet.\n\nComment "COURSE" and I'll help you figure out if your expertise is monetizable. 👇`,
        hashtags: ['#onlinecourse', '#coursecreator', '#teachonline', '#makemoneyonline', '#passiveincome', '#digitalproducts', '#onlinebusiness', '#creatoreconomy', '#knowledgebusiness', '#expertbusiness'],
        cta: 'Comment "COURSE" for curriculum help'
      }
    ]
  }
];

// ─── REVENUE PROJECTION ENGINE ───────────────────────────────────────────────

export function projectRevenue(sector: Sector, followerCount: number) {
  const conversionModels = {
    affiliate: { rate: 0.018, avgSale: 97 },
    coaching: { rate: 0.008, avgSale: 5000 },
    digital_product: { rate: 0.025, avgSale: 197 },
    saas: { rate: 0.015, avgSale: 49 },
    ecommerce: { rate: 0.03, avgSale: 85 },
  };
  const model = conversionModels[sector.revenueModel];
  const estimatedSales = Math.floor(followerCount * model.rate);
  const projectedRevenue = estimatedSales * model.avgSale;
  return {
    estimatedSales,
    projectedRevenue,
    monthlyMin: Math.floor(projectedRevenue * 0.4),
    monthlyMax: Math.floor(projectedRevenue * 1.2),
  };
}

// ─── POSTING TIME OPTIMIZER (based on documented IG engagement peaks) ────────

export const OPTIMAL_POSTING_TIMES = [
  { day: 0, hour: 18, minute: 0, reason: 'Sunday evening peak engagement' },
  { day: 1, hour: 7, minute: 30, reason: 'Monday morning commute scroll' },
  { day: 2, hour: 11, minute: 0, reason: 'Tuesday mid-morning break' },
  { day: 3, hour: 19, minute: 0, reason: 'Wednesday evening leisure time' },
  { day: 4, hour: 8, minute: 0, reason: 'Thursday morning feed check' },
  { day: 5, hour: 20, minute: 0, reason: 'Friday evening wind-down' },
  { day: 6, hour: 10, minute: 0, reason: 'Saturday morning scroll' },
];

export function getNextOptimalSlot(fromDate: Date): Date {
  const d = new Date(fromDate);
  // Try each day of week starting from d+1
  for (let attempt = 1; attempt <= 14; attempt++) {
    d.setDate(d.getDate() + 1);
    const dayOfWeek = d.getDay();
    const slot = OPTIMAL_POSTING_TIMES.find(t => t.day === dayOfWeek);
    if (slot) {
      d.setHours(slot.hour, slot.minute, 0, 0);
      return new Date(d);
    }
  }
  // Fallback
  d.setHours(9, 0, 0, 0);
  return d;
}
