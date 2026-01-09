import { NextRequest, NextResponse } from 'next/server';
import { setUserSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    // Check if user already exists - if yes, just log them in
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user with FOUNDER role
      user = await prisma.user.create({
        data: { 
          email, 
          name,
          role: 'FOUNDER'
        },
      });
    }

    // Set session for both new and existing users
    await setUserSession(user.id);

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name, role: user.role } },
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
