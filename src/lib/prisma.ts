import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const clientOptions = process.env.DATABASE_URL
  ? { datasources: { db: { url: process.env.DATABASE_URL } } }
  : {}

const prisma = global.prisma ?? new PrismaClient(clientOptions as any)

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
