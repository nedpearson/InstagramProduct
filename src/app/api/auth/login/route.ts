import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/login
 * Validates email + password against database Users.
 * Sets httpOnly session cookie on success.
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json() as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Lookup user
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      // Return generic error to prevent user enumeration
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Owner accounts created before the auth system may have no hashedPassword.
    // Accept the configured owner password for backward compat, then encourage migration.
    let passwordValid = false;

    if (user.hashedPassword) {
      passwordValid = await bcrypt.compare(password, user.hashedPassword);
    } else {
      // Fallback: compare against OWNER_PASSWORD env var for legacy admin accounts
      const ownerPassword = process.env.OWNER_PASSWORD ?? 'admin123';
      passwordValid = password === ownerPassword && user.systemRole === 'admin';

      // Auto-upgrade: hash and store the password going forward
      if (passwordValid) {
        const hashed = await bcrypt.hash(password, 12);
        await prisma.user.update({ where: { id: user.id }, data: { hashedPassword: hashed } });
      }
    }

    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Account is disabled. Contact support.' }, { status: 403 });
    }

    // Build session token — use user ID as the session value (simple + verifiable)
    // For production, upgrade to signed JWT with process.env.JWT_SECRET
    const sessionToken = `${user.id}:${Date.now()}`;

    // Set httpOnly secure cookie
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, systemRole: user.systemRole },
    });

    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set('instaflow_session', sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Log auth event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'user.login',
        details: JSON.stringify({ email: user.email }),
      },
    });

    return response;
  } catch (err: any) {
    console.error('[auth/login] Error:', err);
    return NextResponse.json({ error: 'Authentication failed. Please try again.' }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/login
 * Clears the session cookie (logout).
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('instaflow_session');
  return response;
}
