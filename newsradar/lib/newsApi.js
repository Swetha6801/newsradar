/**
 * NewsRadar — API utility layer
 *
 * All data fetching logic lives here.
 * This separation makes it easy to swap the data source (e.g., switch from
 * NewsAPI to another provider) without touching any page component.
 */

const BASE_URL = 'https://newsapi.org/v2';
const API_KEY = process.env.NEWS_API_KEY;

/**
 * Generic fetcher with error handling.
 * Always called server-side (API routes or getServerSideProps).
 */
async function apiFetch(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error(
      'NEWS_API_KEY is not set. Create a .env.local file with your key from https://newsapi.org/register'
    );
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('apiKey', API_KEY);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.set(key, val);
    }
  });

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'NewsRadar/1.0' },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${res.status} from NewsAPI`);
  }

  return res.json();
}

/**
 * Fetch top headlines by category.
 * Used on the home page.
 */
export async function getTopHeadlines({ category = 'general', pageSize = 20, country = 'in' } = {}) {
  return apiFetch('/top-headlines', { category, pageSize, country });
}

/**
 * Search everything — used for the search feature.
 */
export async function searchArticles({ query, pageSize = 20, page = 1, sortBy = 'publishedAt' } = {}) {
  return apiFetch('/everything', { q: query, pageSize, page, sortBy, language: 'en' });
}

/**
 * Get articles for a single source — used on dynamic source pages.
 */
export async function getArticlesBySource({ sources, pageSize = 10 } = {}) {
  return apiFetch('/everything', { sources, pageSize });
}

/**
 * Fetch top sources — used in the sources explorer page.
 */
export async function getSources({ category } = {}) {
  return apiFetch('/top-headlines/sources', { category, language: 'en' });
}

/**
 * Format a raw NewsAPI article into a cleaner shape used across the UI.
 */
export function formatArticle(article) {
  return {
    title: article.title || 'Untitled',
    description: article.description || '',
    url: article.url || '#',
    imageUrl: article.urlToImage || null,
    source: article.source?.name || 'Unknown',
    sourceId: article.source?.id || null,
    publishedAt: article.publishedAt || null,
    author: article.author || null,
    content: article.content || '',
  };
}

/**
 * Format a relative time label, e.g. "3 hours ago"
 */
export function timeAgo(dateString) {
  if (!dateString) return '';
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}
