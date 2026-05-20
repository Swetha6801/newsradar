export default function ErrorMessage({ message }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.icon}>⚠️</div>
      <h3 style={styles.title}>Something went wrong</h3>
      <p style={styles.msg}>{message}</p>
      {message?.includes('NEWS_API_KEY') && (
        <div style={styles.hint}>
          <strong>Setup hint:</strong> Rename <code style={styles.code}>.env.local.example</code> to{' '}
          <code style={styles.code}>.env.local</code> and add your free API key from{' '}
          <a href="https://newsapi.org/register" target="_blank" rel="noopener noreferrer" style={styles.link}>
            newsapi.org
          </a>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    textAlign: 'center',
    padding: '4rem 1rem',
    maxWidth: '480px',
    margin: '0 auto',
  },
  icon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111',
    marginBottom: '0.5rem',
  },
  msg: {
    color: '#666',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  hint: {
    background: '#fff8e7',
    border: '1px solid #f0d080',
    borderRadius: '8px',
    padding: '1rem',
    fontSize: '0.85rem',
    color: '#555',
    textAlign: 'left',
    lineHeight: '1.6',
  },
  code: {
    background: '#f0ede8',
    padding: '1px 5px',
    borderRadius: '3px',
    fontFamily: 'monospace',
    fontSize: '0.85em',
  },
  link: {
    color: '#e63946',
    fontWeight: '500',
  },
};
