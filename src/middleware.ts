import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /app routes
  if (pathname.startsWith('/app') || pathname.startsWith('/projects')) {
    const userId = request.cookies.get('fray_user_id')?.value;

    if (!userId) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/projects/:path*'],
};
