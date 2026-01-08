import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Conectando a la base de datos SQLite...')
  const users = await prisma.user.findMany()
  console.log('Usuarios encontrados:', users)
}

main()
  .catch((e) => {
    console.error('Error en la prueba de DB:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
