'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Founder {
  id: number;
  name: string;
  email: string;
}

interface Test {
  id: number;
  title: string;
  questions: any[];
}

interface Project {
  id: number;
  name: string;
  createdAt: string;
  founder?: Founder | null;
  tests?: Test[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetail({ params }: PageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const startTest = (test: Test) => {
    setActiveTest(test);
    setAnswers({});
    setResult(null);
  };

  const handleSelect = (questionId: number, value: any) => {
    setAnswers((s) => ({ ...s, [questionId]: value }));
  };

  const submitTest = async () => {
    if (!activeTest) return;
    setSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([q, val]) => ({ questionId: Number(q), selectedAnswer: val })),
      };

      const res = await fetch(`/api/tests/${activeTest.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
      } else {
        console.error('Submit failed', await res.text());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

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
          <h2>Perfil</h2>
          {project.founder ? (
            <div>
              <p><strong>Founder:</strong> {project.founder.name}</p>
              <p><strong>Email:</strong> {project.founder.email}</p>
            </div>
          ) : (
            <p>Founder no asignado</p>
          )}
        </div>

        <div className={styles.section}>
          <h2>Test inicial</h2>
          {activeTest ? (
            <div>
              <h3>{activeTest.title}</h3>
              {activeTest.questions.map((q: any) => (
                <div key={q.id} style={{ marginBottom: 12 }}>
                  <p style={{ margin: '6px 0' }}>{q.question}</p>
                  {q.options.map((opt: any) => (
                    <label key={opt} style={{ display: 'block' }}>
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleSelect(q.id, opt)}
                      />{' '}
                      {opt}
                    </label>
                  ))}
                </div>
              ))}

              {result ? (
                <div>
                  <p>Resultado: {result.score} / {result.total}</p>
                </div>
              ) : (
                <div>
                  <button onClick={submitTest} disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar test'}</button>
                </div>
              )}
            </div>
          ) : (
            <div>
              {project.tests && project.tests.length > 0 ? (
                <div>
                  <p>{project.tests.length} test(s) disponible(s).</p>
                  <button onClick={() => startTest(project.tests![0])}>Comenzar test inicial</button>
                </div>
              ) : (
                <p>No hay tests definidos para este proyecto.</p>
              )}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>Progreso</h2>
          <p>Sección placeholder para seguimiento del progreso del proyecto.</p>
        </div>
      </div>
    </div>
  );
}
