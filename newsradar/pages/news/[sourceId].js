/**
 * Dynamic Route — /news/[sourceId]
 *
 * Demonstrates: Dynamic routing with [param] segments, getServerSideProps
 * with route params, and linking dynamic pages together.
 *
 * Each source gets its own URL: /news/techcrunch, /news/bbc-news, etc.
 */

import Layout from '../../components/Layout';
import ArticleCard from '../../components/ArticleCard';
import ErrorMessage from '../../components/ErrorMessage';
import Link from 'next/link';
import { getArticlesBySource, formatArticle } from '../../lib/newsApi';

export default function SourcePage({ sourceId, sourceName, articles, error }) {
  return (
    <Layout title={sourceName ? `${sourceName} — NewsRadar` : 'Source — NewsRadar'}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <Link href="/sources" style={styles.breadcrumbLink}>← All Sources</Link>
          <span style={styles.breadcrumbSep}>/</span>
          <span style={styles.breadcrumbCurrent}>{sourceName || sourceId}</span>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.sourceIcon}>{(sourceName || sourceId).charAt(0).toUpperCase()}</div>
          <div>
            <h1 style={styles.title}>{sourceName || sourceId}</h1>
            <p style={styles.subtitle}>Latest headlines from this source</p>
          </div>
        </div>

        {error ? (
          <ErrorMessage message={error} />
        ) : (
          <div style={styles.grid}>
            {articles.map((article, i) => (
              <div key={`${article.url}-${i}`} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <ArticleCard article={article} />
              </div>
            ))}
            {articles.length === 0 && (
              <p style={styles.empty}>No articles found for this source.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

/**
 * getServerSideProps with dynamic params.
 * context.params.sourceId comes from the [sourceId] filename.
 */
export async function getServerSideProps(context) {
  const { sourceId } = context.params;

  try {
    const data = await getArticlesBySource({ sources: sourceId, pageSize: 20 });
    const articles = (data.articles || []).map(formatArticle);

    // Derive the source name from the first article
    const sourceName = articles[0]?.source || sourceId;

    return {
      props: {
        sourceId,
        sourceName,
        articles,
        error: null,
      },
    };
  } catch (err) {
    return {
      props: {
        sourceId,
        sourceName: sourceId,
        articles: [],
        error: err.message,
      },
    };
  }
}

const styles = {
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '1.25rem 0 0.5rem',
    fontSize: '0.825rem',
    color: '#888',
  },
  breadcrumbLink: {
    color: '#e63946',
    fontWeight: '500',
  },
  breadcrumbSep: {
    color: '#ccc',
  },
  breadcrumbCurrent: {
    color: '#444',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '0.5rem 0 1.5rem',
  },
  sourceIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    background: '#0f0f0f',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111',
    letterSpacing: '-0.02em',
    marginBottom: '2px',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#888',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  empty: {
    color: '#888',
    padding: '2rem 0',
  },
};
