import Link from 'next/link';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout title="404 — Page Not Found | NewsRadar">
      <div style={styles.wrap}>
        <p style={styles.code}>404</p>
        <h1 style={styles.title}>Page not found</h1>
        <p style={styles.msg}>This headline didn't make it to print.</p>
        <Link href="/" style={styles.btn}>Back to Top Stories →</Link>
      </div>
    </Layout>
  );
}

const styles = {
  wrap: {
    textAlign: 'center',
    padding: '5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  code: {
    fontSize: '5rem',
    fontWeight: '700',
    color: '#e63946',
    lineHeight: 1,
    letterSpacing: '-0.05em',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111',
  },
  msg: {
    color: '#888',
    fontSize: '1rem',
  },
  btn: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '10px 24px',
    background: '#0f0f0f',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
};
