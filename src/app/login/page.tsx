'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const payload = mode === 'signup' ? { email, name } : { email };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'An error occurred');
        return;
      }

      // Redirect to dashboard
      router.push('/app');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>FRAY</h1>
        <p className={styles.subtitle}>Plataforma de aprendizaje experimental</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.group}>
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === 'signup'}
              />
            </div>
          )}

          <div className={styles.group}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} className={styles.submit}>
            {loading ? 'Cargando...' : mode === 'signup' ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        <p className={styles.toggle}>
          {mode === 'login' ? '¿Sin cuenta? ' : '¿Ya tienes cuenta? '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
            className={styles.link}
          >
            {mode === 'login' ? 'Crear una' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  );
}
