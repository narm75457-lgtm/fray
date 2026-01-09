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

    const { action, email } = body;

    if (action === 'logout') {
      const { clearUserSession } = await import('@/lib/auth');
      await clearUserSession();
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!email) {
      return NextResponse.json(
        { ok: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    try {
      const { default: prisma } = await import('@/lib/prisma');
      const { setUserSession } = await import('@/lib/auth');

      const cleanEmail = String(email).trim().toLowerCase();

      const user = await prisma.user.findUnique({ 
        where: { email: cleanEmail } 
      });

      if (!user) {
        return NextResponse.json(
          { ok: false, error: 'User not found' },
          { status: 404 }
        );
      }

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
    console.error('Login error:', error);
    return NextResponse.json(
      { ok: false, error: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
