import { NextRequest, NextResponse } from 'next/server';
import { setUserSession, clearUserSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, email } = body;

    if (action === 'logout') {
      await clearUserSession();
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Login action
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    try {
      const user = await prisma.user.findUnique({ 
        where: { email: email.trim().toLowerCase() } 
      });

      if (!user) {
        return NextResponse.json(
          { ok: false, error: 'User not found. Please sign up first.' },
          { status: 404 }
        );
      }

      // Set session
      await setUserSession(user.id);

      return NextResponse.json(
        { 
          ok: true,
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name,
            role: user.role 
          } 
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database error in login:', dbError);
      return NextResponse.json(
        { ok: false, error: 'Authentication failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
