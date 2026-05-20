/**
 * Search Page — /search?q=query
 *
 * Demonstrates: client-side data fetching using the built-in Fetch API,
 * loading states, pagination, and dynamic query handling with useRouter.
 *
 * This page intentionally uses CLIENT-SIDE fetching (not SSR) to contrast
 * with the home page and show you know when to use each approach.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ArticleCard from '../components/ArticleCard';
import ErrorMessage from '../components/ErrorMessage';

export default function SearchPage() {
  const router = useRouter();
  const { q, page = '1', sortBy = 'publishedAt' } = router.query;

  const [articles, setArticles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentPage = Number(page) || 1;

  // Client-side fetch — calls our /api/search API route
  useEffect(() => {
    if (!q) return;

    const controller = new AbortController();

    async function fetchResults() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&page=${currentPage}&sortBy=${sortBy}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Search failed');
        setArticles(data.articles);
        setTotalResults(data.totalResults);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
    return () => controller.abort(); // Cleanup on unmount / query change
  }, [q, currentPage, sortBy]);

  function goToPage(p) {
    router.push({ query: { q, page: p, sortBy } });
  }

  function handleSortChange(e) {
    router.push({ query: { q, page: 1, sortBy: e.target.value } });
  }

  const totalPages = Math.min(Math.ceil(totalResults / 20), 5); // NewsAPI free tier limits

  return (
    <Layout title={q ? `"${q}" — NewsRadar Search` : 'Search — NewsRadar'}>
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              {q ? (
                <>Results for <em style={{ color: '#e63946' }}>&ldquo;{q}&rdquo;</em></>
              ) : (
                'Search'
              )}
            </h1>
            {!loading && totalResults > 0 && (
              <p style={styles.count}>{totalResults.toLocaleString()} articles found</p>
            )}
          </div>

          {/* Sort control */}
          {articles.length > 0 && (
            <div style={styles.sortWrap}>
              <label style={styles.sortLabel} htmlFor="sort">Sort by</label>
              <select id="sort" value={sortBy} onChange={handleSortChange} style={styles.select}>
                <option value="publishedAt">Latest</option>
                <option value="relevancy">Relevance</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={styles.loadingWrap}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Searching…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && <ErrorMessage message={error} />}

        {/* No query yet */}
        {!q && !loading && (
          <p style={styles.hint}>Type something in the search bar above to find news articles.</p>
        )}

        {/* Results */}
        {!loading && !error && articles.length > 0 && (
          <>
            <div style={styles.grid}>
              {articles.map((article, i) => (
                <div key={`${article.url}-${i}`} className="fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  style={{ ...styles.pageBtn, ...(currentPage <= 1 ? styles.pageBtnDisabled : {}) }}
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    style={{ ...styles.pageBtn, ...(p === currentPage ? styles.pageBtnActive : {}) }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  style={{ ...styles.pageBtn, ...(currentPage >= totalPages ? styles.pageBtnDisabled : {}) }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* No results */}
        {!loading && !error && q && articles.length === 0 && (
          <div style={styles.noResults}>
            <p style={{ fontSize: '2rem' }}>🔍</p>
            <p>No articles found for <strong>&ldquo;{q}&rdquo;</strong>. Try a different search term.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </Layout>
  );
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
  count: {
    fontSize: '0.825rem',
    color: '#888',
  },
  sortWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sortLabel: {
    fontSize: '0.825rem',
    color: '#666',
  },
  select: {
    border: '1px solid #e5e5e5',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '0.825rem',
    background: '#fff',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: '#111',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '4rem 0',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid #e5e5e5',
    borderTopColor: '#e63946',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  loadingText: {
    color: '#888',
    fontSize: '0.9rem',
  },
  hint: {
    color: '#888',
    textAlign: 'center',
    padding: '4rem 0',
    fontSize: '1rem',
  },
  noResults: {
    textAlign: 'center',
    padding: '4rem 0',
    color: '#666',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  pagination: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    padding: '2rem 0',
    flexWrap: 'wrap',
  },
  pageBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #e5e5e5',
    background: '#fff',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: '#111',
    transition: 'background 0.15s',
  },
  pageBtnActive: {
    background: '#0f0f0f',
    color: '#fff',
    borderColor: '#0f0f0f',
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
};
