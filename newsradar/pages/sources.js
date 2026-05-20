/**
 * Sources Page — /sources
 *
 * Demonstrates: getStaticProps with revalidation (ISR — Incremental Static Regeneration).
 * The page is pre-built at deploy time and revalidated every hour.
 * Perfect for data that doesn't change often.
 */

import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import ErrorMessage from '../components/ErrorMessage';
import { getSources } from '../lib/newsApi';

const CATEGORIES = ['all', 'technology', 'business', 'sports', 'health', 'science', 'entertainment', 'general'];

export default function SourcesPage({ sources, error }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = (sources || []).filter((s) => {
    const matchCat = filter === 'all' || s.category === filter;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Layout title="News Sources — NewsRadar">
      <div className="container">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>News Sources</h1>
            <p style={styles.subtitle}>
              Browse available sources. Click any source to see its latest headlines.
            </p>
          </div>
          <div style={styles.badge}>
            ISR · revalidates hourly
          </div>
        </div>

        {error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {/* Filters */}
            <div style={styles.controls}>
              <input
                type="search"
                placeholder="Filter sources…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.filterInput}
                aria-label="Filter sources by name"
              />
              <div style={styles.cats}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    style={{ ...styles.catBtn, ...(filter === cat ? styles.catBtnActive : {}) }}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <p style={styles.count}>{filtered.length} sources</p>

            {/* Grid */}
            <div style={styles.grid}>
              {filtered.map((source) => (
                <Link
                  key={source.id}
                  href={`/news/${source.id}`}
                  style={styles.card}
                  className="source-card"
                >
                  <div style={styles.cardTop}>
                    <span style={styles.sourceInitial}>{source.name.charAt(0)}</span>
                    <div>
                      <p style={styles.sourceName}>{source.name}</p>
                      <span style={styles.sourceCat}>{source.category}</span>
                    </div>
                  </div>
                  <p style={styles.sourceDesc}>{source.description}</p>
                  <span style={styles.viewLink}>View headlines →</span>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <p style={styles.empty}>No sources match your filter.</p>
            )}
          </>
        )}
      </div>

      <style>{`
        .source-card { transition: box-shadow 0.2s, transform 0.2s; }
        .source-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
      `}</style>
    </Layout>
  );
}

/**
 * getStaticProps — runs at BUILD TIME (and on-demand with ISR).
 *
 * revalidate: 3600 means Next.js will regenerate this page at most once per hour.
 * This is Incremental Static Regeneration (ISR) — another key Next.js feature.
 */
export async function getStaticProps() {
  try {
    const data = await getSources();
    return {
      props: {
        sources: data.sources || [],
        error: null,
      },
      revalidate: 3600, // ISR: regenerate every hour
    };
  } catch (err) {
    return {
      props: {
        sources: [],
        error: err.message,
      },
      revalidate: 60,
    };
  }
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '1.5rem 0 1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    color: '#111',
    marginBottom: '4px',
  },
  subtitle: {
    color: '#666',
    fontSize: '0.875rem',
  },
  badge: {
    background: '#f0ede8',
    border: '1px solid #e5e5e5',
    borderRadius: '6px',
    padding: '4px 12px',
    fontSize: '0.75rem',
    color: '#666',
    fontFamily: 'monospace',
    letterSpacing: '0.03em',
    alignSelf: 'flex-start',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  filterInput: {
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    color: '#111',
    background: '#fff',
    maxWidth: '320px',
    outline: 'none',
  },
  cats: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  catBtn: {
    padding: '5px 14px',
    borderRadius: '999px',
    border: '1px solid #e5e5e5',
    background: '#f5f4f0',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: '#444',
    transition: 'background 0.15s',
  },
  catBtnActive: {
    background: '#0f0f0f',
    color: '#fff',
    borderColor: '#0f0f0f',
  },
  count: {
    fontSize: '0.8rem',
    color: '#999',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
    color: 'inherit',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sourceInitial: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: '#0f0f0f',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1rem',
    flexShrink: 0,
  },
  sourceName: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#111',
    marginBottom: '2px',
  },
  sourceCat: {
    fontSize: '0.7rem',
    color: '#e63946',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.04em',
  },
  sourceDesc: {
    fontSize: '0.8rem',
    color: '#666',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  viewLink: {
    fontSize: '0.8rem',
    color: '#e63946',
    fontWeight: '500',
    marginTop: 'auto',
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    padding: '2rem 0',
  },
};
