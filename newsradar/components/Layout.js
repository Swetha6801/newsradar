import Navbar from './Navbar';
import Head from 'next/head';

export default function Layout({ children, title = 'NewsRadar — Real-time News Aggregator', description }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description || 'NewsRadar: Latest news headlines from around the world, powered by Next.js'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 56px)', paddingBottom: '3rem' }}>
        {children}
      </main>
      <footer style={footerStyle}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span>Built with <strong>Next.js</strong> · Powered by NewsAPI</span>
          <span style={{ color: '#888', fontSize: '0.8rem' }}>
            API Routes · SSR · Dynamic Routing · SWR-style client fetching
          </span>
        </div>
      </footer>
    </>
  );
}

const footerStyle = {
  background: '#0f0f0f',
  color: '#666',
  fontSize: '0.825rem',
  padding: '1rem 0',
  borderTop: '1px solid #222',
};
