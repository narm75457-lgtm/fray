import styles from './page.module.css'

export default function AppDashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Antigravity Dashboard</h1>
        <p className={styles.lead}>Plataforma en construcción</p>
      </header>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h3>Proyectos</h3>
          <p>Vista general de proyectos y actividad.</p>
        </div>

        <div className={styles.card}>
          <h3>Colaboradores</h3>
          <p>Gestiona miembros y permisos (próximamente).</p>
        </div>

        <div className={styles.card}>
          <h3>Conexión</h3>
          <p>Prisma + Neon configurados — comprobando conexión.</p>
        </div>
      </section>

      <section className={styles.placeholder}>
        <p>Más secciones vendrán pronto. Gracias por tu paciencia ✨</p>
      </section>
    </div>
  )
}
