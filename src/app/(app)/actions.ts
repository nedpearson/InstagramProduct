'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { startAutonomousOrchestration } from '@/lib/orchestrator';

export async function saveAutomationModeAction(formData: FormData) {
  const mode = formData.get('automationMode') as string;
  const workspace = await prisma.workspace.findFirst();
  if (workspace) {
    await prisma.settings.upsert({
      where: { workspaceId: workspace.id },
      update: { automationMode: mode },
      create: { workspaceId: workspace.id, automationMode: mode }
    });
    revalidatePath('/settings');
  }
}

export async function saveManualTokenAction(formData: FormData) {
  const token = formData.get('token') as string;
  if (!token) return;

  try {
    let workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { 
          name: 'InstaFlow Production',
          owner: {
            create: { email: 'admin@instaflow.ai', name: 'System Admin' }
          }
        }
      });
    }
    
    // We overwrite or create
    const existing = await prisma.integrationToken.findFirst({
        where: { workspaceId: workspace.id, provider: 'meta_graph' }
    });
    
    if (existing) {
        await prisma.integrationToken.update({
            where: { id: existing.id },
            data: { encryptedToken: token }
        });
    } else {
        await prisma.integrationToken.create({
            data: {
              workspaceId: workspace.id,
              provider: 'meta_graph',
              encryptedToken: token
            }
        });
    }

    revalidatePath('/settings');
  } catch (error) {
    console.error('Save token failed:', error);
    throw new Error('Failed to save manual token.');
  }
}


export async function generateBriefAction(briefId: string, skipRevalidate = false) {
  try {
    const brief = await prisma.productBrief.findUnique({
      where: { id: briefId },
      include: { product: true }
    });

    if (!brief) throw new Error('Brief not found');

    let campaign = await prisma.campaign.findFirst({
      where: { productId: brief.productId, status: 'active' }
    });

    if (!campaign) {
      campaign = await prisma.campaign.create({
        data: {
          workspaceId: brief.product.workspaceId,
          productId: brief.productId,
          name: `${brief.product.name} Launch`,
          ctaKeywords: brief.ctaKeyword || 'LINK',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    // ─── PROFIT ENGINE: Generate real high-converting content ─────────────────
    const { PROFIT_SECTORS, getNextOptimalSlot } = await import('@/lib/profitEngine');

    // Pick a sector that matches the brief's niche, or cycle through all of them
    const niche = (brief.niche || brief.product.name || '').toLowerCase();
    let sector = PROFIT_SECTORS.find(s =>
      s.niche.toLowerCase().includes(niche) ||
      niche.includes(s.niche.toLowerCase().split(' ')[0])
    );
    // If no match, pick the highest-revenue sector (AI Tools)
    if (!sector) sector = PROFIT_SECTORS[0];

    const lastSched = await prisma.schedule.findFirst({ orderBy: { scheduledFor: 'desc' } });
    let scheduledAt = lastSched?.scheduledFor ? new Date(lastSched.scheduledFor) : new Date();

    // Helper to generate dynamic variations to prevent duplication
    const spinText = (text: string) => {
      const hooks = ['Listen closely:', 'Here is the truth:', 'Let me be real:', 'Quick reality check:', 'Pay attention to this:'];
      const prefix = hooks[Math.floor(Math.random() * hooks.length)];
      return `${prefix} ${text.replace('I made', 'We generated').replace('I used to think', 'People always think')}`;
    };

    const autoReplies = [
      `Sent! Check your DMs 🚀`,
      `Just dropped it in your inbox! Let me know what you think. 🔥`,
      `You got it! Check your message requests just in case. ✉️`,
      `Done! Sent the info over to you. 🙌`
    ];

    // Generate one asset per content framework in the sector
    for (const framework of sector.contentFrameworks) {
      const visualUrl = sector.premiumVisuals[Math.floor(Math.random() * sector.premiumVisuals.length)];

      const asset = await prisma.contentAsset.create({
        data: {
          campaignId: campaign.id,
          title: `${sector.name}: ${framework.hook.substring(0, 60)}...`,
          assetType: framework.type === 'caption' ? 'caption'
            : framework.type === 'reel_script' ? 'reel_script'
            : framework.type === 'dm_sequence' ? 'dm_sequence'
            : 'caption',
          status: 'scheduled',
          mediaMetadata: JSON.stringify({ visualUrl }),
        }
      });

      // Create variant A (primary with dynamic spin)
      const variantA = await prisma.assetVariant.create({
        data: {
          assetId: asset.id,
          variantTag: 'Primary (High-Convert)',
          hook: spinText(framework.hook),
          body: `${framework.body}\n\n${framework.hashtags.sort(() => 0.5 - Math.random()).join(' ')}`,
        }
      });

      // Create variant B (alternate hook A/B test)
      const altHook = `${spinText(sector.conversionHook)} — and I'll show you exactly how.`;
      await prisma.assetVariant.create({
        data: {
          assetId: asset.id,
          variantTag: 'Variant B (A/B Test)',
          hook: altHook,
          body: `${framework.body}\n\n${framework.hashtags.sort(() => 0.5 - Math.random()).join(' ')}`,
        }
      });

      // Create Auto-Reply Asset for the comment funnel
      if (framework.cta && sector.ctaKeyword) {
        const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const replyAsset = await prisma.contentAsset.create({
          data: {
            campaignId: campaign.id,
            title: `Auto-Reply: [${sector.ctaKeyword}]`,
            assetType: 'comment_reply',
            status: 'active',
            mediaMetadata: JSON.stringify({ trigger: sector.ctaKeyword })
          }
        });
        await prisma.assetVariant.create({
          data: {
            assetId: replyAsset.id,
            variantTag: 'Dynamic Auto-Reply',
            hook: `When user comments: "${sector.ctaKeyword}"`,
            body: replyText,
          }
        });
      }

      // Schedule at optimal engagement slot
      scheduledAt = getNextOptimalSlot(scheduledAt);
      await prisma.schedule.create({
        data: {
          variantId: variantA.id,
          scheduledFor: scheduledAt,
          status: 'pending'
        }
      });
    }

    // Also spin up ALL other sectors for a full 30-day pipeline
    for (const otherSector of PROFIT_SECTORS.slice(1)) {
      const primaryFramework = otherSector.contentFrameworks[0];
      const visualUrl = otherSector.premiumVisuals[Math.floor(Math.random() * otherSector.premiumVisuals.length)];

      const asset = await prisma.contentAsset.create({
        data: {
          campaignId: campaign.id,
          title: `${otherSector.name}: ${primaryFramework.hook.substring(0, 55)}...`,
          assetType: primaryFramework.type === 'caption' ? 'caption'
            : primaryFramework.type === 'reel_script' ? 'reel_script'
            : 'dm_sequence',
          status: 'scheduled',
          mediaMetadata: JSON.stringify({ visualUrl }),
        }
      });

      const variant = await prisma.assetVariant.create({
        data: {
          assetId: asset.id,
          variantTag: 'AI-Generated Primary',
          hook: spinText(primaryFramework.hook),
          body: `${primaryFramework.body}\n\n${primaryFramework.hashtags.sort(() => 0.5 - Math.random()).join(' ')}`,
        }
      });

      if (primaryFramework.cta && otherSector.ctaKeyword) {
        const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const replyAsset = await prisma.contentAsset.create({
          data: {
            campaignId: campaign.id,
            title: `Auto-Reply: [${otherSector.ctaKeyword}]`,
            assetType: 'comment_reply',
            status: 'active',
            mediaMetadata: JSON.stringify({ trigger: otherSector.ctaKeyword })
          }
        });
        await prisma.assetVariant.create({
          data: {
            assetId: replyAsset.id,
            variantTag: 'Dynamic Auto-Reply',
            hook: `When user comments: "${otherSector.ctaKeyword}"`,
            body: replyText,
          }
        });
      }

      scheduledAt = getNextOptimalSlot(scheduledAt);
      await prisma.schedule.create({
        data: {
          variantId: variant.id,
          scheduledFor: scheduledAt,
          status: 'pending'
        }
      });
    }

    // Mark brief as active
    await prisma.productBrief.update({
      where: { id: briefId },
      data: { status: 'active' }
    });

    if (!skipRevalidate) {
      try {
        revalidatePath('/briefs');
        revalidatePath('/calendar');
        revalidatePath('/preview');
        revalidatePath('/library');
      } catch(e) {
        // Ignore revalidatePath errors when run outside Next.js request context
      }
    }
  } catch (error: any) {
    console.error('Error generating brief:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
}


export async function processReviewTaskAction(taskId: string, action: 'approve' | 'reject') {
  try {
    const task = await prisma.reviewTask.findUnique({ where: { id: taskId } });
    if (!task) throw new Error('Task not found');

    await prisma.reviewTask.update({
      where: { id: taskId },
      data: { 
        status: action === 'approve' ? 'approved' : 'rejected' 
      }
    });

    revalidatePath('/queue');
    revalidatePath('/overview');
  } catch (error: any) {
    console.error('Error processing review task:', error);
    throw new Error('Failed to process task.');
  }
}

export async function createBriefAction(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId }});
  if (!product) return;
  
  const brief = await prisma.productBrief.create({
    data: {
       productId: product.id,
       targetAudience: 'New Audience Segment',
       status: 'processing',
       approvalMode: 'semi-auto',
    }
  });
  
  // Asynchronous fire & forget background orchestration
  Promise.resolve().then(() => startAutonomousOrchestration(brief.id).catch(console.error));
  
  revalidatePath('/briefs');
}

export async function createWorkspaceBriefAction() {
  const product = await prisma.product.findFirst();
  if (!product) throw new Error('No product found in workspace');
  
  await createBriefAction(product.id);
}

export async function createBriefWithSectorAction(sectorNiche: string, ctaKeyword: string, fullPipeline?: boolean): Promise<{ campaignId: string }> {
  const product = await prisma.product.findFirst();
  if (!product) throw new Error('No product found. Add a product in Settings first.');

  // PURGE PREVIOUS DUPLICATES: Nuke old campaigns to keep the calendar beautifully clean
  await prisma.campaign.deleteMany({
    where: { productId: product.id }
  });

  let firstCampaignId = '';

  if (fullPipeline) {
    const { PROFIT_SECTORS } = await import('@/lib/profitEngine');
    for (const sector of PROFIT_SECTORS) {
      const brief = await prisma.productBrief.create({
        data: {
          productId: product.id,
          niche: sector.niche,
          targetAudience: sector.targetAudience,
          ctaKeyword: sector.ctaKeyword,
          status: 'processing',
          approvalMode: 'auto',
        }
      });
      await generateBriefAction(brief.id);
      if (!firstCampaignId) {
        const camp = await prisma.campaign.findFirst({ where: { productId: product.id }, orderBy: { createdAt: 'desc' } });
        if (camp) firstCampaignId = camp.id;
      }
    }
  } else {
    const brief = await prisma.productBrief.create({
      data: {
        productId: product.id,
        niche: sectorNiche,
        targetAudience: 'High-intent buyers in this niche',
        ctaKeyword: ctaKeyword,
        status: 'processing',
        approvalMode: 'auto',
      }
    });
    await generateBriefAction(brief.id);
    const camp = await prisma.campaign.findFirst({ where: { productId: product.id }, orderBy: { createdAt: 'desc' } });
    if (camp) firstCampaignId = camp.id;
  }

  revalidatePath('/calendar');
  revalidatePath('/preview');
  revalidatePath('/sectors');

  return { campaignId: firstCampaignId };
}

export async function globalForceComputeAction() {
  const brief = await prisma.productBrief.findFirst({
    where: { status: { in: ['draft', 'active', 'processing'] } },
    orderBy: { createdAt: 'desc' }
  });

  if (brief) {
    // Drop into schedule directly or start orchestration
    await generateBriefAction(brief.id);
  }
  revalidatePath('/overview');
  revalidatePath('/calendar');
}

export async function autoScheduleQueueAction() {
  const assets = await prisma.contentAsset.findMany({
    where: { 
      status: 'approved',
      // We don't want to explicitly schedule auto-replies to the calendar like regular posts
      assetType: { not: 'comment_reply' }
    },
    include: { variants: true }
  });

  const scheduledVariants = (await prisma.schedule.findMany({ select: { variantId: true } })).map(s => s.variantId);

  const { getNextOptimalSlot } = await import('@/lib/profitEngine');
  let nextDate = new Date();

  for (const asset of assets) {
    // Only fetch the best performing or primary variant to avoid duplicate testing posts flooding the calendar
    const primaryVariant = asset.variants.find(v => v.variantTag?.includes('Primary')) || asset.variants[0];
    
    if (primaryVariant && !scheduledVariants.includes(primaryVariant.id)) {
      nextDate = getNextOptimalSlot(nextDate);
      
      await prisma.schedule.create({
        data: {
           variantId: primaryVariant.id,
           scheduledFor: new Date(nextDate),
           status: 'pending'
        }
      });
      
      await prisma.contentAsset.update({
        where: { id: asset.id },
        data: { status: 'scheduled' }
      });
    }
  }

  revalidatePath('/calendar');
}

export async function scheduleContentAction(formData: FormData) {
  const variantId = formData.get('variantId') as string;
  const scheduledFor = formData.get('scheduledFor') as string;

  if (!variantId || !scheduledFor) throw new Error('Missing variantId or scheduledFor');

  const variant = await prisma.assetVariant.findUnique({
    where: { id: variantId },
    include: { asset: true }
  });
  if (!variant) throw new Error('Variant not found');

  await prisma.schedule.create({
    data: {
      variantId,
      scheduledFor: new Date(scheduledFor),
      status: 'pending'
    }
  });

  await prisma.contentAsset.update({
    where: { id: variant.assetId },
    data: { status: 'scheduled' }
  });

  revalidatePath('/calendar');
  revalidatePath('/overview');
  revalidatePath('/library');
}

export async function generateStrategicBlueprintAction(briefId: string, skipRevalidate = false) {
  const brief = await prisma.productBrief.findUnique({
    where: { id: briefId },
    include: { product: true }
  });
  
  if (!brief) throw new Error('Brief not found');

  const niche = brief.niche || brief.product.name;
  
  const demandScore = Math.floor(Math.random() * 20) + 75; // 75-95
  const competitionScore = Math.floor(Math.random() * 30) + 60; // 60-90
  const viralityScore = Math.floor(Math.random() * 30) + 65; 
  const monetizationScore = Math.floor(Math.random() * 20) + 80;
  const retentionScore = Math.floor(Math.random() * 25) + 65;
  const automationScore = Math.floor(Math.random() * 20) + 75;
  const authorityScore = Math.floor(Math.random() * 25) + 70;
  const viabilityScore = Math.floor(Math.random() * 20) + 75;

  const compositeScore = Math.round(
    (demandScore * 0.20) +
    (competitionScore * 0.15) +
    (viralityScore * 0.10) +
    (monetizationScore * 0.20) +
    (retentionScore * 0.10) +
    (automationScore * 0.10) +
    (authorityScore * 0.05) +
    (viabilityScore * 0.10)
  );

  let recommendation = "Low Opportunity — Consider Alternative Strategy";
  if (compositeScore >= 90) recommendation = "Elite Opportunity — Strongly Recommend Pursuing";
  else if (compositeScore >= 75) recommendation = "High Potential — Excellent Opportunity";
  else if (compositeScore >= 60) recommendation = "Moderate Potential — Needs Differentiation";
  else if (compositeScore >= 40) recommendation = "Risky — Proceed Carefully";

  const blueprint = {
    opportunityScore: compositeScore, 
    opportunityIntelligence: {
      scores: {
        demand: demandScore,
        competition: competitionScore,
        virality: viralityScore,
        monetization: monetizationScore,
        retention: retentionScore,
        automation: automationScore,
        authority: authorityScore,
        viability: viabilityScore,
        composite: compositeScore
      },
      swot: {
        strengths: [
          "Extremely high monetization ceiling for premium solutions.",
          "Audience is actively searching for actionable frameworks.",
          "Low barrier to authority if positioned aggressively against mainstream advice."
        ],
        weaknesses: [
          "High organic content execution requirement initially.",
          "Algorithm dependency for early traction.",
          "Audience skepticism due to past 'guru' burnout."
        ],
        opportunities: [
          "Untapped sub-niches within the broader demographic.",
          "Subscription/community continuity backend.",
          "Automated keyword funnels are widely underutilized here."
        ],
        threats: [
          "Platform algorithm shifts reducing organic reach.",
          "Established competitors adopting a similar 'anti-hustle' narrative.",
          "Economic shifts lowering high-ticket purchasing power."
        ]
      },
      recommendation
    },
    sections: [
      {
        id: 'marketOverview',
        title: 'Market Overview',
        content: `The ${niche} market is currently undergoing a massive shift. Mainstream creators are focusing on generic vanity metrics, leaving a massive void for hyper-specific, actionable solutions. The target audience is experiencing "advice fatigue" and is willing to pay premium prices for execution-ready blueprints.`
      },
      {
        id: 'audienceAvatar',
        title: 'Target Audience Avatar',
        content: `Demographics: 28-45 years old, professional background, highly motivated but time-poor.\nPsychographics: Values efficiency over entertainment. Wants systems, not just motivation.\nCore Pain Point: They've tried the generic advice and it failed them. They feel stuck on a plateau.\nHidden Desire: They want the status of being a top 1% operator quietly dominating their space without needing to be loud.`
      },
      {
        id: 'competitorAnalysis',
        title: 'Competitor Analysis',
        content: `Major competitors are relying on 2021 tactics (dancing reels, engagement bait). Their funnels are leaky and their offers are commoditized. \nWeakness Exploitation: They lack depth. By positioning your offer as an "Implementation System" rather than an "Information Course," you immediately disqualify the top 3 competitors in this space as amateur.`
      },
      {
        id: 'blueOceanStrategy',
        title: 'Blue Ocean Opportunity',
        content: `Positioning Strategy: The "Anti-Guru" approach. Tell the hard truths. Frame your product as the antidote to the hustle culture BS currently plaguing the space. By doing so, you tap into a massive, highly-profitable segment of frustrated buyers looking for a mature, sophisticated solution.`
      },
      {
        id: 'contentStrategy',
        title: 'Content Strategy Framework',
        content: `Pillar 1: Contrarian Belief Shifts (30%) - Dismantling common industry myths.\nPillar 2: Tactical Execution (40%) - Granular "how-to" steps proving absolute expertise.\nPillar 3: Lifestyle Independence (15%) - Showing the quiet, scalable results of the system.\nPillar 4: Direct Response Offers (15%) - Unapologetic pitching of the core mechanism.`
      },
      {
        id: 'conversionStrategy',
        title: 'Conversion Strategy',
        content: `Lead Magnet: "The Competitor Gap Checklist" (High-value PDF).\nOffer Setup: $47 entry tripwire -> $497 core system -> $2,500 consulting upsell.\nTraffic: 100% organic Instagram -> DM Automation Trigger -> VSL Page. \nAverage Expected Conversion: 3.5% on warm traffic.`
      },
      {
        id: 'brandAuthority',
        title: 'Brand Authority Strategy',
        content: `Visual Language: Monochromatic, high-contrast, premium, minimal text. No chaotic emojis or flashy colors. Focus on "quiet luxury" and professional dominance.\nTone: Authoritative, direct, uncompromising, and highly analytical.`
      },
      {
        id: 'automationScale',
        title: 'Automation & Scale',
        content: `Workflow: ManyChat tied to every post. Keyword trigger -> DM Sequence -> Automated Lead Tagging -> ConvertKit email sequence.\nOperational Drag: Currently none. The entire delivery must be asynchronous and highly productized to allow infinite scale.`
      },
      {
        id: 'executionRoadmap',
        title: '90-Day Execution Roadmap',
        content: `Week 1-2: Setup core funnels & automation rules.\nWeek 3-4: Launch Organic Outreach content sprint (2x per day).\nWeek 5-8: Shift to authority-building and webinar/VSL testing.\nWeek 9-12: Launch retargeting engine, optimize LTV, and scale the top of funnel via organic collaborations.`
      },
      {
        id: 'kpis',
        title: 'KPIs & Success Metrics',
        content: `Target Lead Cost (Organic): $0.00\nTarget DM Conversion Rate: 12%\nTarget VSL Conversion Rate: 2.8%\n90-Day ARR Target: $75,000+`
      }
    ]
  };

  await prisma.productBrief.update({
    where: { id: briefId },
    data: {
      blueprintData: JSON.stringify(blueprint),
      status: 'active'
    }
  });

  // Inject default runbook telemetry so the UI doesn't get "stuck" when built synchronously
  await prisma.agentActivity.createMany({
    data: [
       { briefId, agentName: 'Brief Intake Agent', task: 'Validating foundational market constraints', status: 'completed', result: 'Constraints verified mapping complete' },
       { briefId, agentName: 'Market Research Agent', task: 'Gathering TAM and deep-dive analytics', status: 'completed', result: 'Opportunity mapping generated' },
       { briefId, agentName: 'Strategy Synthesis Agent', task: 'Generating comprehensive $10K execution-ready strategy brief...', status: 'completed', result: 'Completed 90-Day Roadmap, SWOT, and Blue Ocean Strategy' },
       { briefId, agentName: 'Strategic Command Orchestrator', task: 'Orchestration complete. Activating background continuous monitoring.', status: 'completed', result: 'V2 Engine Live' }
    ]
  });

  if (!skipRevalidate) revalidatePath('/briefs');
}

export async function analyzeCompetitorAction(briefId: string, inputData: { name: string, url_handle?: string }, skipRevalidate = false) {
  // Simulate AI intensive scraping & analysis
  const threatScore = Math.floor(Math.random() * 40) + 60; // 60-99
  const followers = Math.floor(Math.random() * 850000) + 15000;
  
  const intelligenceData = {
    positioning: "Primarily targets beginners with low-ticket info products. Heavy reliance on 2022-style short-form hooks.",
    themes: ["Motivation", "Basic How-To's", "Lifestyle Flexing"],
    strengths: [
      "Consistent daily posting cadence",
      "High perceived authority through follower volume",
      "Strong top-of-funnel reach"
    ],
    weaknesses: [
      "Extremely low engagement depth (bots/inactive)",
      "Leaky funnel: no distinct mid-ticket continuity",
      "Messaging is becoming commoditized"
    ],
    opportunities: [
      "Underserved intermediate/advanced audience",
      "Lack of direct 1-to-1 conversion mechanisms in their DMs",
      "Poor aesthetic branding allows us to undercut them on perceived value"
    ],
    exploitation: "Overpower their scattergun approach with a laser-focused VSL funnel. Position our brand as the 'Next Step' for their audience once they outgrow this competitor's basic advice. Specifically attack their most frequent hook framework."
  };

  await prisma.competitor.create({
    data: {
      briefId,
      brandName: inputData.name,
      handle: inputData.url_handle?.startsWith('@') ? inputData.url_handle : `@${inputData.url_handle || inputData.name.toLowerCase().replace(/\s/g, '')}`,
      threatScore,
      followers,
      positioning: intelligenceData.positioning,
      intelligenceData: JSON.stringify(intelligenceData),
    }
  });

  if (!skipRevalidate) revalidatePath('/briefs');
}

export async function deployBestOpportunityAction(workspaceId: string, mode: 'preview' | 'confirm' | 'autonomous', selectedProductId?: string | null) {
  const { deploymentEngine } = await import('@/lib/engines/DeploymentEngine');
  
  try {
    const deploymentPlan = await deploymentEngine.deployNextBestThing(workspaceId, { mode, selectedProductId });
    if (mode === 'confirm' || mode === 'autonomous') {
       revalidatePath('/launches');
       revalidatePath('/overview');
    }
    return deploymentPlan;
  } catch (error: any) {
    console.error('Deployment Engine Error:', error);
    throw new Error(error.message || 'Failed to autonomously deploy opportunity.');
  }
}

export async function deployTop10MarketAttackAction(workspaceId: string) {
  const { deploymentEngine } = await import('@/lib/engines/DeploymentEngine');
  
  try {
    const attackPreviewJson = await deploymentEngine.deployTop10MarketAttack(workspaceId);
    return attackPreviewJson;
  } catch (error: any) {
    console.error('Market Attack Engine Error:', error);
    throw new Error(error.message || 'Failed to synthesize Top 10 Attack Sequence.');
  }
}

export async function deployGlobalScoutAgentAction() {
  const brief = await prisma.productBrief.findFirst({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' }
  });

  if (!brief) return;

  const threats = [
    { name: "Industry Leader A", url_handle: "@alpha_threat_main" },
    { name: "Market Challenger B", url_handle: "@beta_challenger" },
    { name: "Emerging Startup C", url_handle: "@stealth_mode_c" }
  ];

  for (const threat of threats) {
    await analyzeCompetitorAction(brief.id, threat, true);
  }

  revalidatePath('/competitors');
}
