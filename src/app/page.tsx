import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Antigravity</h1>
          <p className={styles.lead}>
            Plataforma experimental para gestionar proyectos en la nube — Prisma + Neon
            listo.
          </p>
          <div className={styles.ctas}>
            <a className={styles.primary} href="/app">
              Entrar
            </a>
            <a className={styles.secondary} href="#features">
              Conocer más
            </a>
          </div>
        </section>
        <section id="features" className={styles.features}>
          <div className={styles.card}>
            <h3>Base moderna</h3>
            <p>Next.js + Prisma + Neon. Despliegue listo en Vercel.</p>
          </div>
          <div className={styles.card}>
            <h3>Seguridad</h3>
            <p>Variables en Vercel y buenas prácticas para secretos.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
