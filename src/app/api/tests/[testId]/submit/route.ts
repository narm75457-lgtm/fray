import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params;
    const tid = parseInt(testId, 10);
    if (isNaN(tid)) {
      return NextResponse.json({ error: 'Invalid test id' }, { status: 400 });
    }

    const payload = await request.json();
    const { answers } = payload;

    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 });
    }

    const { default: prisma } = await import('@/lib/prisma');
    const { getUserSession } = await import('@/lib/auth');

    const userId = await getUserSession();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const test = await prisma.test.findUnique({ where: { id: tid } });
    if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

    const questions: any[] = test.questions as any[];

    // Calculate score
    let correct = 0;
    for (const a of answers) {
      const q = questions.find((qq) => qq.id === a.questionId);
      if (q && q.correctAnswer === a.selectedAnswer) correct += 1;
    }

    const score = correct;

    const response = await prisma.testResponse.create({
      data: {
        testId: tid,
        userId,
        answers,
        score,
      },
    });

    return NextResponse.json({ result: { score, total: questions.length }, response });
  } catch (error) {
    console.error('Submit test error:', error);
    return NextResponse.json({ error: 'Failed to submit test' }, { status: 500 });
  }
}
