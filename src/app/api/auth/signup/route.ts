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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user with FOUNDER role
    const user = await prisma.user.create({
      data: { 
        email, 
        name,
        role: 'FOUNDER'
      },
    });

    // Set session
    await setUserSession(user.id);

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name, role: user.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to signup' },
      { status: 500 }
    );
  }
}
