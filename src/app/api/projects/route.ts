import prisma from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(projects)
  } catch (e) {
    console.error('GET /api/projects error:', e)
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return Response.json({ error: 'Invalid project name' }, { status: 400 })
    }

    const userId = await getUserSession()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        founderId: userId,
      },
    })
    return Response.json(project, { status: 201 })
  } catch (e) {
    console.error('POST /api/projects error:', e)
    return Response.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
