import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Always return JSON, no matter what
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { ok: false, error: 'Email and name are required' },
        { status: 400 }
      );
    }

    try {
      const { default: prisma } = await import('@/lib/prisma');
      const { setUserSession } = await import('@/lib/auth');

      const cleanEmail = String(email).trim().toLowerCase();
      const cleanName = String(name).trim();

      // Find or create user
      let user = await prisma.user.findUnique({ 
        where: { email: cleanEmail } 
      });

      if (!user) {
        user = await prisma.user.create({
          data: { 
            email: cleanEmail, 
            name: cleanName,
            role: 'FOUNDER'
          },
        });
      }

      // Set session
      await setUserSession(user.id);

      return NextResponse.json(
        { 
          ok: true,
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name
          } 
        },
        { status: 200 }
      );
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { ok: false, error: dbError?.message || 'Database error' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { ok: false, error: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
