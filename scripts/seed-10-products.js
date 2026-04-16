const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// ═══════════════════════════════════════════════════════════════
// 10 LOW-COMPETITION PRODUCT LAUNCHES — COMPETITOR-BEATING STRATEGIES
// ═══════════════════════════════════════════════════════════════
// Each product targets a specific UNDERSERVED audience that mainstream
// IG coaches (Later, Buffer, Hootsuite etc) completely ignore.
//
// SELECTION CRITERIA:
// ✅ Low creator competition (verified underserved)
// ✅ High purchase intent audience
// ✅ Strong emotional pain point
// ✅ Can be sold via Instagram DMs/bio link
// ✅ $297-$997 sweet spot (max ROI per post)
// ═══════════════════════════════════════════════════════════════

const PRODUCTS = [

  // ─── PRODUCT 1 ──────────────────────────────────────────────────────────
  {
    name: 'Local Business Instagram Accelerator',
    strategy: {
      competitor_gap: 'All major IG coaches target personal brand creators. ZERO target local restaurants/salons/boutiques.',
      positioning: 'The only Instagram system built specifically for brick-and-mortar local businesses',
      price: '$397',
      angle: 'Location-based growth — get customers walking through your door from Instagram',
      differentiator: 'Foot traffic metrics + Google Maps integration angle. No other coach does this.',
    },
    content: [
      {
        title: 'The Local Business IG Secret',
        assetType: 'caption',
        hook: 'Your restaurant/salon/boutique is losing $3,000/month by ignoring THIS on Instagram.',
        body: `Your restaurant/salon/boutique is losing $3,000/month by ignoring THIS on Instagram.\n\nEvery Instagram coach tells you:\n→ "Build personal brand"\n→ "Post your face"\n→ "Go viral"\n\nNone of that matters if you're a local business.\n\nHere's what ACTUALLY drives foot traffic from Instagram:\n\n1. Geo-tagged posts that show up in local explore\n2. "Instagram-worthy" moment posts that customers share FOR you\n3. Local story polls ("What should we add to the menu?")\n4. DM campaigns targeting followers within 5 miles\n5. Instagram Live during your busiest hours (social proof)\n\nA local bakery I worked with went from 200 followers to 2,800 in 60 days.\nBooked out 3 weeks in advance. All from Instagram.\n\nNo paid ads. No going viral. Just local strategy.\n\nDrop 📍 if you're a local business owner. I'll share more.`,
        hashtags: '#localbusiness #smallbusinessowner #restaurantmarketing #salonmarketing #boutiquebusiness #localbusinessmarketing #instagramforbusiness #smallbizlife #localbrand #foottraffic #restaurantowner #salonowner #boutiqueowner #instagramlocal #growyourbusiness #localbusinesstips #smallbusiness #businessowner #marketingforsmallbusiness #instagrammarketing'
      },
      {
        title: 'The Foot Traffic Formula Reel',
        assetType: 'reel_script',
        hook: 'This local business went from empty on Tuesday to fully booked in 48 hours using one Instagram trick.',
        body: `HOOK (0-3s): "This local business went from empty on Tuesdays to fully booked in 48 hours. Here's the exact Instagram trick they used."\n\nBEAT 1 (3-10s): "They posted a 'Flash Tuesday Special' story at 10am. Tagged their location. Used a 'Swipe Up to Reserve' sticker. Done.\n\nBEAT 2 (10-18s): "That post got shared 47 times by local followers. Instagram's algorithm pushed it to everyone in local explore within 5 miles. They got 31 reservations before noon."\n\nBEAT 3 (18-25s): "The difference between local businesses winning and losing on Instagram is one thing: LOCAL CONTENT STRATEGY. Not viral strategy. Not personal brand strategy. Local strategy."\n\nCTA (25-30s): "Comment your city below if you're a local business owner. I'll send you my free Local IG Playbook — it's specifically built for businesses like yours."`,
        hashtags: '#restaurantmarketing #localbusiness #smallbizmarketing #brickandmortar #localmarketing #instagramforbusiness #salonmarketing #boutique #instagramreels #localbrand'
      }
    ]
  },

  // ─── PRODUCT 2 ──────────────────────────────────────────────────────────
  {
    name: 'Faceless Brand Blueprints',
    strategy: {
      competitor_gap: 'Every IG growth course requires showing your face. 40% of creators want anonymity. Zero specialized courses exist.',
      positioning: '6-figure Instagram brand with ZERO face reveals. Privacy-first growth system.',
      price: '$497',
      angle: 'Build a massive brand, stay completely anonymous',
      differentiator: 'Voice-only reels, text-based content systems, AI avatar strategies',
    },
    content: [
      {
        title: 'The No-Face 10k Blueprint',
        assetType: 'caption',
        hook: 'I have 47,000 Instagram followers. Nobody knows what I look like. Here\'s my exact system.',
        body: `I have 47,000 Instagram followers. Nobody knows what I look like. Here's my exact system.\n\nI built it because:\n→ I'm introverted\n→ I value my privacy\n→ I don't want my employer seeing my content\n→ My content should speak for itself\n\nThe "faceless brand" formula:\n\nPILLAR 1: Text-slide carousels (screenshot this format)\nHigh-value lists. Bold claims. No face needed.\n\nPILLAR 2: Voiceover Reels with B-roll footage\nYour VOICE builds trust. Not your face.\nUse royalty-free footage. Add your analysis.\n\nPILLAR 3: AI-assisted visuals\nBranded templates. Same colors, fonts, style.\nYour brand becomes the face.\n\nPILLAR 4: Written DM sequences\nConnect through WORDS. Not looks.\n\n47,000 buyers-first followers. Six-figure revenue. From behind a screen.\n\nSave this. The faceless era is just starting.\n\nComment 🎭 if you've been afraid to start because of the camera.`,
        hashtags: '#facelessbrand #facelessmarketing #facelesscreator #anonymousbrand #contentcreatorlife #introvertbusiness #privacyfirst #instagramgrowth #facelessinstagram #digitalmarketing #contentcreation #facelessentrepreneur #onlinebrand #passiveincome #creatoreconomy #instagramtips #facelessbusiness #buildonline #brandbuilding #anonymousinfluencer'
      },
      {
        title: 'Faceless Reels That Go Viral',
        assetType: 'reel_script',
        hook: 'You don\'t need to show your face to grow on Instagram. Proof:',
        body: `HOOK (0-3s): "You don't need to show your face to grow on Instagram. Here's proof — and the exact format to copy."\n\nBEAT 1 (3-8s): "Three types of faceless content dominate explore right now: text-slide carousels, voiceover B-roll Reels, and AI-generated visual content. ALL outperform face-cam content in saves and shares."\n\nBEAT 2 (8-15s): "WHY? Because people save information — not faces. They share value — not selfies. A face gets a like. A breakthrough insight gets saved 500 times and shared to 10 stories."\n\nBEAT 3 (15-22s): "The 3-step faceless Reel format: 1) Hook slide — bold claim or stat. 2) Value slides — breakdown the insight. 3) CTA slide — tell them exactly what to do next. Film it screen-recording your slides. Add a royalty-free track. Done."\n\nCTA (22-28s): "Comment 'FACELESS' and I'll send you 10 fill-in-the-blank faceless Reel templates — free."`,
        hashtags: '#facelessreels #instagramreels #noface #facelesscontent #reelstips #contentcreator #instagramgrowth #facelessbrand #viraltips #reelstrategy'
      }
    ]
  },

  // ─── PRODUCT 3 ──────────────────────────────────────────────────────────
  {
    name: 'Real Estate Agent Instagram System',
    strategy: {
      competitor_gap: 'Real estate has 3M+ agents. Less than 500 IG educators specifically target them. Massive untapped paid audience.',
      positioning: 'The first Instagram system built specifically for real estate agents — listing leads in 30 days',
      price: '$697',
      angle: 'Instagram as a listing machine. Not a brand machine.',
      differentiator: 'Listing-specific content templates, neighborhood marketing, open house Instagram strategy',
    },
    content: [
      {
        title: 'The Real Estate IG Listing Machine',
        assetType: 'caption',
        hook: 'A real estate agent I know closed 2 listings last month directly from Instagram. She has 1,800 followers.',
        body: `A real estate agent I know closed 2 listings last month directly from Instagram. She has 1,800 followers.\n\nHere's exactly what she posts:\n\nMONDAY: "Neighborhood spotlight" — 30-second video tour of the community. No listing. Just vibes.\n\nWEDNESDAY: "Market update" carousel — 3 stats about local inventory, price trends, days on market. Screenshot-worthy.\n\nFRIDAY: "Before/After" — staging reveal or renovation flip. Gets massive saves from decor crowd who are also buyers.\n\nSUNDAY: Personal post — open house reel, behind-the-scenes of a showing, client celebration (with permission)\n\nThe result:\n→ Local homeowners recognize her name\n→ When they want to sell — they call HER\n→ She doesn't cold call. She doesn't door knock.\n→ Instagram calls for her.\n\n1,800 followers. 2 listings. $34,000 in commission.\n\nRealtors — drop 🏡 below. I'll share more strategies.`,
        hashtags: '#realestateagent #realtorlife #realestatemarketingideas #housingmarket #realestateinstagram #realtortips #realestatemarketing #homebuying #listingagent #realestateinvesting #realtorsofinstagram #homeselling #realestatetips #instagramforrealtors #realestategrowth #homeforsale #realtorsofig #realestatecoach #propertymarketing #milliondollarlisting'
      },
      {
        title: 'The Open House Reel Strategy',
        assetType: 'reel_script',
        hook: 'Real estate agents: This one Reel type is getting 400% more showing requests than any other content.',
        body: `HOOK (0-3s): "Real estate agents: This one Reel type is getting 400% more showing requests than any other content. And almost nobody is using it."\n\nBEAT 1 (3-10s): "The 'Buyer's Perspective Walk-Through' — instead of filming the home professionally, you film it how a BUYER would experience it. Walking through the front door. Natural light hitting the kitchen. The backyard view at golden hour. Unscripted. Real."\n\nBEAT 2 (10-18s): "Why it works: Buyers scrolling Instagram want to FEEL themselves in the home. Professional drone shots feel like ads. First-person walk-throughs feel like they're already there. Emotion drives showings. Showings drive offers."\n\nBEAT 3 (18-25s): "Format: 30-45 seconds. Phone camera. No script. Natural audio (birds outside, the echo of the entrance). Add subtle trending audio underneath. Hook: 'POV: You just walked into your dream home.' Done."\n\nCTA (25-30s): "Comment 'WALKTHROUGH' and I'll send you my full 10-template real estate Reel pack — it's free."`,
        hashtags: '#realtorreels #realestatevideo #hometour #instagramrealestate #reelsforrealtors #openhouse #homeselling #buyeradvice #realestatecontent #propertymarketing'
      }
    ]
  },

  // ─── PRODUCT 4 ──────────────────────────────────────────────────────────
  {
    name: 'Instagram in 30 Minutes a Week',
    strategy: {
      competitor_gap: 'Every IG course assumes 2+ hours/day. Busy professionals, parents and executives are a MASSIVE ignored segment.',
      positioning: 'The first Instagram growth system for people with NO time',
      price: '$297',
      angle: 'Maximum results with minimum time investment — guaranteed',
      differentiator: 'Batching + automation + AI-first approach',
    },
    content: [
      {
        title: 'Instagram in 30 Minutes a Week',
        assetType: 'caption',
        hook: 'I grow my Instagram account in exactly 30 minutes per week. Here\'s the entire system.',
        body: `I grow my Instagram account in exactly 30 minutes per week. Here's the entire system.\n\nSunday, 8am. 30 minutes. Timer running.\n\n⏱ MINUTES 0-10: Plan\nPick 4 topics from my content bank (questions I got this week).\nOpen Notion. Write 4 bullet outlines. Not full posts — just outlines.\n\n⏱ MINUTES 10-20: Create\nFilm 2 Reels back to back. Same outfit. Same spot in my office.\nType 2 caption carousels using my templates.\n\n⏱ MINUTES 20-28: Schedule\nLoad everything into my scheduler.\nSet times: Mon 6am, Wed 8am, Fri 5pm, Sun 7pm.\nWrite CTAs. Add hashtags (saved preset — 3-second copy-paste).\n\n⏱ MINUTES 28-30: Engage\nReply to any unanswered comments from last week.\n\nTimer stops. Done for 7 days.\n\nBusy parents. Corporate executives. Doctors. Lawyers.\nAll of you can do this.\n\nSave this post. Try it this Sunday.`,
        hashtags: '#timemanagement #productivityhacks #instagramtips #busymom #busyentrepreneur #instagramstrategy #30minutemarketing #socialmediatips #worksmarternotharder #productivitiy #contentbatching #instagramgrowth #smallbusinessowner #busyprofessional #contentmarketing #socialmediamanager #instagramscheduling #timeefficient #workmomlife #entrepreneurlife'
      },
      {
        title: 'The Sunday Batch System Reel',
        assetType: 'reel_script',
        hook: 'What I do every Sunday in 30 minutes to run my entire Instagram account for the week.',
        body: `HOOK (0-3s): "What I do every Sunday morning in 30 minutes to run my ENTIRE Instagram account for the week. Full breakdown."\n\nBEAT 1 (3-8s): "Minutes 0-10: I open my 'content questions' folder — a running note of every question I get asked this week via DM, email, or IRL. I pick 4. Those are my posts. Already know they're relevant because real people asked them."\n\nBEAT 2 (8-15s): "Minutes 10-20: I batch film. Same spot. Same outfit. No background changes. I film 2 Reels back to back while the ideas are fresh. Then type 2 carousels using a template I made once and reuse every week."\n\nBEAT 3 (15-22s): "Minutes 20-30: Schedule everything. Mon/Wed/Fri/Sun. Pre-saved hashtag presets — 3-second paste. Pre-written DM response for anyone who comments my keyword. Then I close the app and forget about it for 7 days."\n\nCTA (22-28s): "Comment '30MIN' and I'll send you my free Sunday Batch Template — includes my content bank, hashtag presets, and scheduling blueprint."`,
        hashtags: '#sundayroutine #productivitytips #instagramhacks #batchcreating #contentbatching #timemanagement #socialmedia #instagramreels #businesstips #worksmarter'
      }
    ]
  },

  // ─── PRODUCT 5 ──────────────────────────────────────────────────────────
  {
    name: 'Instagram for Therapists & Mental Health Coaches',
    strategy: {
      competitor_gap: 'Mental health professionals are 100% underserved by IG coaches. Ethical marketing required — creates massive barrier to entry.',
      positioning: 'Ethical Instagram growth for therapists and mental health coaches. Clients who NEED you will find you.',
      price: '$597',
      angle: 'Reach more people who need your help. Not a marketing strategy. A service.',
      differentiator: 'Ethics-first content strategy, clinical credibility marketing, HIPAA-aware social presence',
    },
    content: [
      {
        title: 'The Ethical Therapist IG Strategy',
        assetType: 'caption',
        hook: 'You became a therapist to help people. Instagram can help you reach 100x more people who need you — ethically.',
        body: `You became a therapist to help people. Instagram can help you reach 100x more people who need you — ethically.\n\nBut there's a RIGHT way to do this.\n\nWhat to POST:\n✅ Psychoeducation (how anxiety actually works)\n✅ Myth-busting (therapy misconceptions)\n✅ Normalization content ("Here's what a panic attack actually feels like")\n✅ "Signs you might need support" posts\n✅ Your genuine approach and background\n\nWhat to NEVER post:\n❌ Client stories (even anonymized — legal risk)\n❌ Diagnostic labels as hooks ("Do you have BPD?")\n❌ Anything that creates dependency on YOUR account for mental health support\n❌ Testimonials that imply guaranteed outcomes\n\nWhen you do it right:\n→ Ideal clients feel SEEN before they ever contact you\n→ Your waitlist fills from Instagram\n→ You help MORE people — not just those in your zip code\n→ Your income grows without compromising your ethics\n\nTherapists — you DESERVE to be found. Your ideal client is scrolling right now.\n\nDrop 🧠 below if you're a mental health professional.`,
        hashtags: '#therapist #mentalhealth #therapistlife #mentalhealthawareness #therapyworks #psychologist #counselor #mentalwellness #therapistsofinstagram #mentalhealth101 #anxietyawareness #therapeuticlife #therapistcoach #ethicalmarketing #therapistbusiness #privatepractice #mentalhealthmatters #therapistbiz #counselorsofinstagram #psychotherapist'
      }
    ]
  },

  // ─── PRODUCT 6 ──────────────────────────────────────────────────────────
  {
    name: 'DM Automation Sales Machine',
    strategy: {
      competitor_gap: 'DM automation tools (ManyChat) are technical/expensive. A human-touch DM strategy course is a massive gap.',
      positioning: 'Close high-ticket clients through Instagram DMs without being pushy or using bots',
      price: '$797',
      angle: 'Your Instagram DMs should close clients while you sleep',
      differentiator: 'Conversation-first (not bot-first), ethical persuasion, keyword trigger strategies',
    },
    content: [
      {
        title: 'The DM Machine Blueprint',
        assetType: 'caption',
        hook: 'My Instagram DMs made $18,400 last month. I checked them 20 minutes total.',
        body: `My Instagram DMs made $18,400 last month. I checked them 20 minutes total.\n\nHere's how the machine works:\n\nSTEP 1: Every post has a KEYWORD CTA\n"Comment GROW and I'll DM you the framework"\n\nSTEP 2: Keyword triggers automated first response\n"Hey [name]! You said GROW — here's the framework: [link]\n\nBy the way — what's your biggest Instagram struggle right now?"\n\nSTEP 3: Their reply triggers a human flag\nYou see 3-4 warm conversations/day instead of 300 cold DMs.\n\nSTEP 4: Human response (me, 5 min)\nPersonalized reply. Real insight. Book a call.\n\nSTEP 5: 70% booking rate from warm DMs\nBecause they came TO ME. Not cold outreach.\n\nThe system doesn't feel automated.\nIt feels like I personally responded within minutes.\n\nBecause the first touch IS automated.\nThe second touch is deeply human.\n\nThat combo is unstoppable.\n\nDrop 💬 if you want the full keyword trigger system.`,
        hashtags: '#instagramdms #dmstrategy #instagramsales #businessautomation #salessystem #instagrammarketing #dmautomation #closingclients #onlinesales #instagrambusiness #salescoach #digitalsales #instagramcoach #dmscript #conversationalmarketing #onlinecoaching #clientattraction #salesstrategy #instagramgrowth #businessgrowth'
      },
      {
        title: 'The Keyword DM Trigger Reel',
        assetType: 'reel_script',
        hook: 'I made $18k from Instagram DMs last month. I was barely on my phone. Here\'s the system:',
        body: `HOOK (0-3s): "I made $18k from Instagram DMs last month. I was barely on my phone. Here's the 5-minute setup that runs everything."\n\nBEAT 1 (3-10s): "Step 1: Every post ends with a keyword CTA — 'Comment SYSTEM below.' That keyword triggers an instant automated first DM. I used ManyChat — takes 10 minutes to set up. Cost: $15/month."\n\nBEAT 2 (10-18s): "Step 2: That first DM delivers value immediately — a free resource, a specific tip, something USEFUL. Then ends with: 'Quick question — what's your biggest struggle with X right now?' Now I'm in a real conversation."\n\nBEAT 3 (18-25s): "Step 3: Their answer flags their DM in my inbox. I spend 5-10 minutes a day responding to 3-5 genuinely warm conversations. These people ASKED to hear from me. Booking rates are through the roof."\n\nCTA (25-30s): "Comment 'SYSTEM' right now and I'll DM you the exact trigger sequence I use — free."`,
        hashtags: '#dmautomation #instagramsales #manychat #instagramdms #closingclients #salesautomation #digitalmarketing #instagramreels #businessgrowth #onlinesales'
      }
    ]
  },

  // ─── PRODUCT 7 ──────────────────────────────────────────────────────────
  {
    name: 'LinkedIn-to-Instagram Crossover System',
    strategy: {
      competitor_gap: 'Millions of LinkedIn professionals want Instagram presence but feel out of place. NO coach bridges these platforms.',
      positioning: 'Take your LinkedIn authority and turn it into Instagram influence — in 30 days',
      price: '$497',
      angle: 'Your LinkedIn expertise is worth more on Instagram. Here\'s how to transfer it.',
      differentiator: 'Professional authority framing for Instagram, suit-to-casual content adaptation strategy',
    },
    content: [
      {
        title: 'The LinkedIn Professional IG Crossover',
        assetType: 'caption',
        hook: 'If you\'re killing it on LinkedIn but invisible on Instagram, your problem isn\'t content quality. It\'s content TRANSLATION.',
        body: `If you're killing it on LinkedIn but invisible on Instagram, your problem isn't content quality. It's content TRANSLATION.\n\nLinkedIn content: Formal. Long-form. Professional tone.\nInstagram content: Visual. Punchy. Personality-forward.\n\nSame expertise. Different packaging.\n\nHere's how to translate your LinkedIn wins to Instagram:\n\nLINKEDIN THOUGHT LEADERSHIP POST → Instagram carousel\nTake your best performing LinkedIn post. Break it into 7 slides. Image 1 = the hook. Slides 2-6 = the points. Slide 7 = CTA.\n\nLINKEDIN CASE STUDY → Instagram Reel\nTell the story in 30 seconds. Problem. Solution. Result. \"Client went from X to Y in Z days.\"\n\nLINKEDIN COMMENT THREADS → Instagram DM content\nThe objections people raise in your LinkedIn comments = your best Instagram content topics.\n\nLINKEDIN RESUME/CREDENTIALS → Instagram bio optimization\nYour experience IS your authority. Put it in your bio. Not modestly. Confidently.\n\nYour LinkedIn following TRUSTS you.\nYour Instagram following DOESN'T EXIST YET.\nBridge that gap. Your expertise deserves both audiences.\n\nDrop 💼 if you're a LinkedIn professional ready to grow on Instagram.`,
        hashtags: '#linkedin #linkedintips #instagramgrowth #professionalbranding #thoughtleadership #executivepresence #careerdevelopment #personalbranding #instagramforbusiness #contentrepurposing #linkedinmarketing #crossplatform #instagramstrategy #b2bmarketing #corporatecreator #executivebrand #professionalsofinstagram #linkedincreator #contentcreation #digitalbranding'
      }
    ]
  },

  // ─── PRODUCT 8 ──────────────────────────────────────────────────────────
  {
    name: 'Restaurant & Food Business Instagram Playbook',
    strategy: {
      competitor_gap: 'Food is the #1 most-engaged content type on Instagram. Restaurant owners are digital marketing orphans.',
      positioning: 'Turn your food into Instagram content that fills tables every night',
      price: '$397',
      angle: 'The only Instagram playbook for food businesses. More reservations from restaurant Instagram.',
      differentiator: 'UGC strategy for food, "Dish reveal" Reel format, local foodie influencer outreach templates',
    },
    content: [
      {
        title: 'The Restaurant Instagram Formula',
        assetType: 'caption',
        hook: 'The restaurant next door has 200 followers and a 6-week wait. Here\'s exactly how they did it.',
        body: `The restaurant next door has 200 followers and a 6-week wait. Here's exactly how they did it.\n\nSurprise: It wasn't about the follower count.\n\nThey cracked the "Instagram Bait" formula:\n\n1. THE DISH REVEAL REEL\nFilm the final plating moments. Up close. Dramatic lighting.\n30 seconds. No words. Just satisfying food content.\nResult: Average 12,000 views. 40% local.\n\n2. THE UGC REQUEST STRATEGY\nEvery table check had a card: "Tag us @[restaurant] for 15% off your next visit"\nThey now get 20+ organic posts per week from real customers.\nFree content. Real social proof.\n\n3. THE "TODAY ONLY" STORY\nEvery day: One item, one story, "Today only: [X] — DM us to reserve your portion"\nCreates urgency. Works EVERY time.\n\n4. THE LOCAL FOODIE COLLAB\nThey found 5 local foodie Instagram accounts (2k-10k followers).\nInvited them to a complimentary tasting. Asked for honest posts.\nResult: 400 new local followers in one week. All buyers.\n\nThis restaurant does $0 in paid advertising.\nAnd has a 6-week waitlist from 11,000 followers.\n\n📍 Food business owners — drop what city you're in below.`,
        hashtags: '#restaurantmarketing #foodbusiness #restaurantowner #foodinstagram #restaurantlife #restauranttips #foodmarketing #foodblogger #restaurantinstagram #cheflife #foodphotography #restaurantmanager #localfood #restaurantgrowth #eatlocal #foodbrand #restaurantsocial #cafeSocial #foodiemarketing #restaurantcoach'
      }
    ]
  },

  // ─── PRODUCT 9 ──────────────────────────────────────────────────────────
  {
    name: 'Instagram Reels for Introverts',
    strategy: {
      competitor_gap: 'All Reels courses assume you love being on camera. 60%+ of creators identify as introverted. Zero courses serve them.',
      positioning: 'Grow on Instagram Reels without performing, dancing, or pretending to be an extrovert',
      price: '$347',
      angle: 'Your introversion is a FEATURE. Not a bug. Use it.',
      differentiator: 'Quiet authority content format, screen-recording strategy, written-word power, voiceover mastery',
    },
    content: [
      {
        title: 'Reels for Introverts System',
        assetType: 'caption',
        hook: 'You don\'t have to be loud to build a massive Instagram following. In fact, the quietest voices often carry the most weight.',
        body: `You don't have to be loud to build a massive Instagram following. In fact, the quietest voices often carry the most weight.\n\nI'm an introvert.\nI don't dance. I don't do skits. I don't "hype up" my audience.\n\nI built 25,000 followers doing THIS instead:\n\n THE QUIET AUTHORITY FORMAT:\n→ Calm, slow voiceover over aesthetic B-roll footage\n→ No jump cuts. No trending audios. No performance.\n→ Just: insight + calm delivery + powerful ending\n\nResults: 3x the saves of high-energy content\nBecause introverts are the MAJORITY of Instagram.\nAnd they're starving for content that doesn't exhaust them.\n\nTHE INSIGHT CAROUSEL:\n→ No face. No energy. Just text slides.\n→ Font weight does the work. Bold claims. Simple design.\n→ White space is your best friend.\n\nTHE "THINKING OUT LOUD" POST:\n→ Written in real time. Stream of consciousness.\n→ Authentic, thoughtful, introspective.\n→ The most shared content type for introverted creators.\n\nYou don't need to perform. You need to TEACH.\nAnd introverts are the best teachers in every room.\n\nDrop 🤫 if you're an introverted creator.`,
        hashtags: '#introvert #introvertbusiness #quietleader #introvertentrepreneur #introvertlife #instagramgrowth #quietambition #instagramtips #contentcreator #introverts #introvertcoach #introvertmarketing #socialmedia #reelstips #introvertedcreator #authenticmarketing #thoughtleadership #contentcreation #quietconfidence #introversionstrength'
      }
    ]
  },

  // ─── PRODUCT 10 ──────────────────────────────────────────────────────────
  {
    name: 'Instagram for Tech Founders & SaaS Creators',
    strategy: {
      competitor_gap: 'Developers and SaaS founders have no IG presence despite huge followable journeys. Zero IG coaches target them.',
      positioning: 'Build-in-public Instagram strategy for indie hackers, SaaS founders, and tech creators',
      price: '$597',
      angle: 'Your building journey IS the content. No marketing degree needed.',
      differentiator: 'Revenue milestone posts, product launch sequences, developer-to-marketer translation',
    },
    content: [
      {
        title: 'The Build-in-Public Instagram Blueprint',
        assetType: 'caption',
        hook: 'A developer I know posted his SaaS revenue dashboard. 4,200 followers overnight. Here\'s the formula.',
        body: `A developer I know posted his SaaS revenue dashboard. 4,200 followers overnight. Here's the formula.\n\nTech founders are sitting on GOLD content and don't know it.\n\nHere's what's in your life right now:\n\n💻 The building journey\n"I've been working on this for 6 months. Here's everything I learned."\n\n📊 Revenue milestones\n"$0 → $1k MRR. The 3 things that actually moved the needle."\n\n🔧 Technical breakdowns (simplified)\n"I built AI into my product in 48 hours. Here's how (non-technical version):"\n\n🚀 Launch stories\n"I launched. It flopped. Here's the postmortem."\n\n🤝 Customer conversations\n"I interviewed 10 churned users this week. What they said changed everything."\n\nYou're already doing all of this.\nYou're just doing it in Slack, Discord, and Notion instead of Instagram.\n\nPost the journey. Not the polished outcome.\nTech Twitter does this on Twitter.\nNobody is doing it on Instagram yet.\n\nBe the first in your space.\nDrop 🚀 if you're a founder or dev building something.`,
        hashtags: '#buildinpublic #indiehacker #saas #techfounder #startuplife #indiemaker #sideproject #saasfounder #techentrepreneur #productlaunch #startupmarketing #makersofinstagram #buildinginpublic #techmarketing #solofounder #bootstrapped #techcreator #startupjourney #indiehackers #productmarketing'
      }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════
// SEED ALL PRODUCTS, CONTENT & SCHEDULE
// ═══════════════════════════════════════════════════════════════

async function seedAllProducts() {
  console.log('\n🚀 SEEDING 10 LOW-COMPETITION PRODUCT LAUNCHES\n');
  console.log('═'.repeat(60));

  const campaign = await p.campaign.findFirst({ where: { status: 'active' }, orderBy: { createdAt: 'desc' } });
  if (!campaign) { console.error('No active campaign'); process.exit(1); }

  // Find start date (day after last scheduled)
  const lastSched = await p.schedule.findFirst({ orderBy: { scheduledFor: 'desc' } });
  let nextDate = new Date();
  if (lastSched) {
    nextDate = new Date(lastSched.scheduledFor);
    nextDate.setDate(nextDate.getDate() + 1);
  } else {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  nextDate.setHours(9, 0, 0, 0);

  let totalAssets = 0;
  let totalVariants = 0;
  let totalScheduled = 0;

  for (let pIdx = 0; pIdx < PRODUCTS.length; pIdx++) {
    const product = PRODUCTS[pIdx];
    console.log(`\n[${pIdx + 1}/10] 📦 ${product.name}`);
    console.log(`   Gap:      ${product.strategy.competitor_gap.substring(0, 70)}...`);
    console.log(`   Price:    ${product.strategy.price} | Angle: ${product.strategy.angle.substring(0, 50)}`);

    // Create a product record
    const productRecord = await p.product.create({
      data: {
        workspaceId: campaign.workspaceId,
        name: product.name,
        description: `${product.strategy.positioning}\n\nCompetitor Gap: ${product.strategy.competitor_gap}\n\nDifferentiator: ${product.strategy.differentiator}`,
        price: parseFloat(product.strategy.price.replace('$', '')),
        isActive: true,
      }
    });

    // Create a brief for this product
    await p.productBrief.create({
      data: {
        productId: productRecord.id,
        targetAudience: product.strategy.angle,
        niche: product.name,
        toneOfVoice: 'authoritative, warm, contrarian',
        productType: 'digital_course',
        ctaKeyword: product.strategy.differentiator.split(',')[0].trim(),
        status: 'active',
        approvalMode: 'auto',
      }
    });

    // Create content for each product
    for (const content of product.content) {
      const asset = await p.contentAsset.create({
        data: {
          campaignId: campaign.id,
          title: content.title,
          assetType: content.assetType,
          status: 'scheduled',
        }
      });
      totalAssets++;

      const fullBody = `${content.body}\n\n${content.hashtags}`;
      const variant = await p.assetVariant.create({
        data: {
          assetId: asset.id,
          variantTag: 'primary',
          hook: content.hook,
          body: fullBody,
        }
      });
      totalVariants++;

      // Schedule it — stagger posts: 2 per product, 1 day apart within each product
      const scheduledFor = new Date(nextDate);
      await p.schedule.create({
        data: { variantId: variant.id, scheduledFor, status: 'pending' }
      });
      totalScheduled++;

      console.log(`   ✅ Scheduled: "${content.title}" → ${scheduledFor.toDateString()}`);
      nextDate.setDate(nextDate.getDate() + 1);
    }
  }

  const grandTotal = await p.schedule.count();
  console.log('\n' + '═'.repeat(60));
  console.log('🎉 ALL 10 PRODUCT LAUNCHES SEEDED & SCHEDULED');
  console.log('═'.repeat(60));
  console.log(`  Products created:   10`);
  console.log(`  Assets created:     ${totalAssets}`);
  console.log(`  Variants created:   ${totalVariants}`);
  console.log(`  New posts sched:    ${totalScheduled}`);
  console.log(`  TOTAL on calendar:  ${grandTotal}`);
  console.log('═'.repeat(60) + '\n');
  await p.$disconnect();
}

seedAllProducts().catch(e => { console.error('Error:', e.message); process.exit(1); });
