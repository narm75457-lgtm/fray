import { NextRequest, NextResponse } from 'next/server';
import { setUserSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const { default: prisma } = await import('@/lib/prisma');

    // Check if user exists, if not create
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, name },
      });
    }

    // Set session
    await setUserSession(user.id);

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to signup' },
      { status: 500 }
    );
  }
}
