import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id, 10);
    if (isNaN(projectId)) return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });

    const { default: prisma } = await import('@/lib/prisma');
    const tests = await prisma.test.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(tests);
  } catch (error) {
    console.error('GET tests error:', error);
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id, 10);
    if (isNaN(projectId)) return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });

    const { default: prisma } = await import('@/lib/prisma');
    const { getUserSession } = await import('@/lib/auth');

    const userId = await getUserSession();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Create a simple 5-question test template
    const questions = [
      { id: 1, question: '¿Qué es FRAY?', options: ['Plataforma', 'Lenguaje', 'Base de datos'], correctAnswer: 'Plataforma' },
      { id: 2, question: '¿Qué ORM usamos?', options: ['Sequelize', 'Prisma', 'TypeORM'], correctAnswer: 'Prisma' },
      { id: 3, question: '¿Dónde desplegamos?', options: ['Heroku', 'Vercel', 'Netlify'], correctAnswer: 'Vercel' },
      { id: 4, question: '¿Qué base usamos?', options: ['MySQL', 'Postgres', 'SQLite'], correctAnswer: 'Postgres' },
      { id: 5, question: '¿Qué proveedor DB usamos?', options: ['Neon', 'Supabase', 'Firebase'], correctAnswer: 'Neon' },
    ];

    const test = await prisma.test.create({
      data: {
        projectId,
        title: 'Test inicial',
        questions: questions as any,
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error('Create test error:', error);
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
  }
}
