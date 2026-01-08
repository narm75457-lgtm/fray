'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

interface Project {
  id: number
  name: string
  createdAt: string
}

export default function AppDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [projectName, setProjectName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setProjects(data)
    } catch (e) {
      console.error('Error fetching projects:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName }),
      })
      if (!res.ok) throw new Error('Failed to create')
      const newProject = await res.json()
      setProjects([newProject, ...projects])
      setProjectName('')
    } catch (e) {
      console.error('Error creating project:', e)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Antigravity Dashboard</h1>
        <p className={styles.lead}>Plataforma en construcción</p>
      </header>

      <section className={styles.createSection}>
        <form onSubmit={handleCreateProject} className={styles.form}>
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            disabled={creating}
          />
          <button type="submit" disabled={creating}>
            {creating ? 'Creando...' : 'Crear proyecto'}
          </button>
        </form>
      </section>

      <section className={styles.projectsSection}>
        <h2>Tus Proyectos</h2>
        {loading ? (
          <p className={styles.placeholder}>Cargando...</p>
        ) : projects.length === 0 ? (
          <p className={styles.placeholder}>
            No hay proyectos aún. ¡Crea uno para empezar!
          </p>
        ) : (
          <div className={styles.list}>
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/app/projects/${project.id}`}
                className={styles.projectItem}
              >
                <h3>{project.name}</h3>
                <p className={styles.date}>
                  {new Date(project.createdAt).toLocaleDateString('es-ES')}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
