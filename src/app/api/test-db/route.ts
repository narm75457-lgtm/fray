export async function GET() {
  const { default: prisma } = await import('@/lib/prisma')
  try {
    const users = await prisma.user.findMany()
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('API /api/test-db error:', e)
    return new Response(JSON.stringify({ error: 'failed' }), { status: 500 })
  }
}
