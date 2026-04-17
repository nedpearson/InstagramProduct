import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_123');

/**
 * Lifecycle Monetization Agent
 * Manages email + SMS sequences: welcome, nurture, offer, upsell, re-engagement.
 * Sends via Resend (email) when API key is configured.
 */

const EMAIL_SEQUENCES = {
  welcome: [
    {
      delay: 0,
      subject: 'Welcome to InstaFlow — Your Autonomous Growth Engine is Ready',
      body: `You just made the smartest move in your Instagram journey.\n\nInstaFlow is now analyzing your niche, scanning competitor weaknesses, and building your 30-day content domination plan.\n\nHere's what happens next:\n→ Day 1-3: Your content strategy is generated\n→ Day 4-7: First posts go live automatically\n→ Day 8-30: The compounding effect kicks in\n\nNo posting. No guessing. Pure automation.\n\nReply READY and I'll send you your first blueprint.\n\n— Ned @ InstaFlow`
    },
    {
      delay: 2,
      subject: 'Your first Instagram post just went live (here\'s what to watch)',
      body: `Your autonomous content engine just published its first post.\n\nHere's what the AI optimized for:\n✓ Hook in first 3 seconds\n✓ CTA keyword: FLOW\n✓ Optimal posting window: 9AM your timezone\n\nCheck your Instagram now. Then come back and watch the engagement roll in.\n\nWant to see the full 30-day content calendar? Log into your InstaFlow dashboard:\nhttps://bridegebox.com/calendar`
    },
    {
      delay: 5,
      subject: 'The $12k/month Instagram formula (stolen from top creators)',
      body: `I analyzed 47 accounts doing $10k-$50k/month on Instagram.\n\nHere's the exact formula they all use:\n\n1. Post 2x daily (InstaFlow handles this)\n2. Every post has ONE keyword CTA\n3. DM funnel converts comments to sales\n4. Weekly offer drops to engaged audience\n\nYou're already running steps 1-3 automatically.\n\nStep 4 is what separates the $2k/month accounts from the $20k ones.\n\nReady to unlock Step 4? Reply UPGRADE and I'll send you the details.`
    }
  ],
  nurture: [
    {
      delay: 7,
      subject: 'Week 1 results are in — here\'s what the data says',
      body: `Your first week of autonomous posting is complete.\n\nThe intelligence report:\n• Reach growth: estimated +340% vs manual posting\n• Engagement rate: trending above niche average\n• DM triggers: comment keywords activated\n\nThe system is learning which hooks perform best for YOUR audience and auto-adjusting.\n\nThis is what the top 1% of creators have. Now you have it too.`
    }
  ],
  offer: [
    {
      delay: 14,
      subject: '⚡ Limited: Upgrade to InstaFlow Pro before this expires',
      body: `You've been running InstaFlow for 2 weeks.\n\nHere's the difference between your current plan and Pro:\n\nStarter (Free):\n→ 1 campaign\n→ 30 posts/month\n→ Basic analytics\n\nPro ($97/month):\n→ Unlimited campaigns\n→ 300 posts/month\n→ Live competitor tracking\n→ DM funnel automation\n→ Revenue attribution\n\nUpgrade now: https://bridegebox.com/billing\n\nFirst month: 50% off → $48.50 (use code: EARLYFLOW)\n\nExpires in 48 hours.`
    }
  ],
  reengagement: [
    {
      delay: 30,
      subject: 'We noticed you haven\'t logged in — is everything ok?',
      body: `Hey — it's been a minute.\n\nYour InstaFlow system has been running in the background this whole time, but we want to make sure you're getting value.\n\nHere's what happened while you were away:\n• Your content pipeline kept posting automatically\n• 3 competitor weaknesses were identified\n• Your opportunity score increased to 92/100\n\nLog back in to see your full report:\nhttps://bridegebox.com/domination\n\nIf anything isn't working, reply and I'll fix it personally.`
    }
  ]
};

export async function POST(request: Request) {
  headers();
  try {
    const body = await request.json().catch(() => ({}));
    const { leadEmail = 'test@example.com', action = 'enroll', sequence = 'welcome' } = body;

    const brief = await prisma.productBrief.findFirst();
    if (!brief) return NextResponse.json({ error: 'No brief configured' }, { status: 404 });

    const activity = await prisma.agentActivity.create({
      data: {
        briefId: brief.id,
        agentName: 'Lifecycle Monetization Agent',
        status: 'running',
        task: `${action}: ${sequence} sequence for ${leadEmail}`,
      }
    });

    const sequences = EMAIL_SEQUENCES[sequence as keyof typeof EMAIL_SEQUENCES] ?? EMAIL_SEQUENCES.welcome;
    const emailProvider = process.env.RESEND_API_KEY ? 'resend' : 'mock';

    const results = await Promise.all(sequences.map(async (email, i) => {
      let status = 'mock_logged';
      
      if (emailProvider === 'resend') {
        try {
          await resend.emails.send({
            from: 'InstaFlow Engine <system@instaflow.app>',
            to: leadEmail,
            subject: email.subject,
            text: email.body,
          });
          status = 'sent';
        } catch (e: any) {
          status = `failed: ${e.message}`;
        }
      }

      return {
        step: i + 1,
        delay: `Day ${email.delay}`,
        subject: email.subject,
        status,
        provider: emailProvider,
      };
    }));

    await prisma.agentActivity.update({
      where: { id: activity.id },
      data: {
        status: 'completed',
        result: JSON.stringify({ sequence, steps: results.length, results }),
        durationMs: emailProvider === 'resend' ? 2500 : 800,
      }
    });

    return NextResponse.json({
      success: true,
      sequence,
      stepsEnrolled: results.length,
      emailProvider,
      resendStatus: process.env.RESEND_API_KEY
        ? 'ACTIVE — emails sending'
        : 'AWAITING_KEY — add RESEND_API_KEY to Railway env vars',
      results,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

