/**
 * Home Page — /
 *
 * Demonstrates: getServerSideProps (SSR), category-based filtering via query params,
 * and client-side category switching with router.
 *
 * On each request, Next.js calls getServerSideProps on the server,
 * fetches news via our internal API route, and renders the page with data.
 */

import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ArticleCard from '../components/ArticleCard';
import CategoryBar from '../components/CategoryBar';
import ErrorMessage from '../components/ErrorMessage';
import { getTopHeadlines, formatArticle } from '../lib/newsApi';

const VALID_CATEGORIES = ['general', 'technology', 'business', 'sports', 'health', 'science', 'entertainment'];

export default function HomePage({ articles, category, error, totalResults }) {
  const router = useRouter();

  const featured = articles?.[0];
  const rest = articles?.slice(1) || [];

  return (
    <Layout title={`NewsRadar — ${category.charAt(0).toUpperCase() + category.slice(1)} News`}>
      <div className="container">
        <CategoryBar active={category} />

        {error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {/* Section header */}
            <div style={styles.header}>
              <h1 style={styles.sectionTitle}>
                {category === 'general' ? 'Top Stories' : `${category.charAt(0).toUpperCase() + category.slice(1)} News`}
              </h1>
              <span style={styles.count}>{totalResults?.toLocaleString()} stories</span>
            </div>

            {/* Featured article — SSR rendered */}
            {featured && (
              <div style={styles.featuredWrap} className="fade-up">
                <ArticleCard article={featured} variant="featured" />
              </div>
            )}

            {/* Article grid */}
            <div style={styles.grid}>
              {rest.map((article, i) => (
                <div
                  key={`${article.url}-${i}`}
                  className="fade-up"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            {rest.length === 0 && !error && (
              <p style={styles.empty}>No articles found for this category.</p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

/**
 * getServerSideProps — runs on every request on the server.
 *
 * Key things this demonstrates:
 * - Reading query params (category) from context
 * - Calling the data layer (lib/newsApi.js) directly — no HTTP round-trip
 * - Returning data as props; errors handled gracefully
 * - The page is always up-to-date (unlike static generation)
 */
export async function getServerSideProps(context) {
  const { category = 'general' } = context.query;

  // Validate category — redirect to /general if invalid
  if (!VALID_CATEGORIES.includes(category)) {
    return {
      redirect: { destination: '/?category=general', permanent: false },
    };
  }

  try {
    const data = await getTopHeadlines({ category, pageSize: 20 });
    const articles = (data.articles || []).map(formatArticle);

    return {
      props: {
        articles,
        category,
        totalResults: data.totalResults || 0,
        error: null,
      },
    };
  } catch (err) {
    return {
      props: {
        articles: [],
        category,
        totalResults: 0,
        error: err.message,
      },
    };
  }
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    margin: '1.25rem 0 1rem',
    flexWrap: 'wrap',
    gap: '8px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    color: '#111',
  },
  count: {
    fontSize: '0.8rem',
    color: '#999',
  },
  featuredWrap: {
    marginBottom: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  empty: {
    color: '#999',
    textAlign: 'center',
    padding: '3rem 0',
    fontSize: '1rem',
  },
};
