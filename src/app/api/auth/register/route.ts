import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/register
 * Creates a new User account, provisions a default workspace and 14-day trial subscription,
 * then sets an httpOnly session cookie.
 */
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json() as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for duplicate
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user + workspace + subscription in a transaction
    const { user, subscription } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          name: name?.trim() || normalizedEmail.split('@')[0],
          hashedPassword,
          systemRole: 'user',
          isActive: true,
        },
      });

      const workspace = await tx.workspace.create({
        data: {
          name: `${user.name}'s Workspace`,
          ownerId: user.id,
          members: {
            create: {
              userId: user.id,
              role: 'admin',
            },
          },
        },
      });

      // Provision 14-day trial
      const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      const subscription = await tx.subscription.create({
        data: {
          planId: 'starter',
          status: 'trial',
          billingCycle: 'monthly',
          trialEndsAt,
          mrr: 0,
        },
      });

      // Log the trial start
      await tx.billingEvent.create({
        data: {
          subscriptionId: subscription.id,
          type: 'trial_started',
          planId: 'starter',
        },
      });

      // Create initial workspace settings
      await tx.settings.create({
        data: {
          workspaceId: workspace.id,
          environment: 'production',
          automationMode: 'semi-auto',
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'user.registered',
          details: JSON.stringify({ email: normalizedEmail, plan: 'starter_trial' }),
        },
      });

      return { user, subscription };
    });

    // Set session cookie
    const sessionToken = `${user.id}:${Date.now()}`;
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    }, { status: 201 });

    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set('instaflow_session', sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('[auth/register] Error:', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
