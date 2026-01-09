import { NextRequest, NextResponse } from 'next/server';
import { setUserSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, name } = body;

    // Validate input
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    try {
      // Check if user already exists
      let user = await prisma.user.findUnique({ 
        where: { email: email.trim().toLowerCase() } 
      });

      if (!user) {
        // Create new user with FOUNDER role
        user = await prisma.user.create({
          data: { 
            email: email.trim().toLowerCase(), 
            name: name.trim(),
            role: 'FOUNDER'
          },
        });
      }

      // Set session for both new and existing users
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
      console.error('Database error in signup:', dbError);
      return NextResponse.json(
        { ok: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
