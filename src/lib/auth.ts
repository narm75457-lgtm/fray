import { cookies } from 'next/headers';

export const USER_COOKIE = 'fray_user_id';

export async function setUserSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set(USER_COOKIE, String(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/'
  });
}

export async function getUserSession(): Promise<number | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_COOKIE)?.value;
  return userId ? parseInt(userId, 10) : null;
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE);
}
