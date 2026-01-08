'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Project {
  id: number;
  name: string;
  createdAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetail({ params }: PageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div className={styles.container}><p>Cargando...</p></div>;
  if (!project) return <div className={styles.container}><p>Proyecto no encontrado</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/app" className={styles.backLink}>← Volver</Link>
        <h1>{project.name}</h1>
        <p className={styles.meta}>Creado: {new Date(project.createdAt).toLocaleDateString('es-ES')}</p>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h2>Mentor IA</h2>
          <p>Sección placeholder para mentor con inteligencia artificial.</p>
        </div>

        <div className={styles.section}>
          <h2>Tests</h2>
          <p>Sección placeholder para tests y validaciones del proyecto.</p>
        </div>

        <div className={styles.section}>
          <h2>Progreso</h2>
          <p>Sección placeholder para seguimiento del progreso del proyecto.</p>
        </div>
      </div>
    </div>
  );
}
