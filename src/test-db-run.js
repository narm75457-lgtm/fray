const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  __internal: {
    // Provide an engine hint and override runtime config so the client can initialize when run with Node
    engine: { type: 'binary' },
    configOverride: (cfg) => ({
      ...cfg,
      datasource: { url: 'file:./prisma/dev.db' },
      activeProvider: 'sqlite',
    }),
  },
})

async function main() {
  console.log('Conectando a SQLite vía Prisma...')
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
