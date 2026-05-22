/**
 * NewsRadar — API utility layer (GNews)
 *
 * Uses GNews API (gnews.io) — works on deployed domains unlike NewsAPI free tier.
 * Get a free key at https://gnews.io (100 requests/day free).
 */

const BASE_URL = 'https://gnews.io/api/v4';
const API_KEY = process.env.GNEWS_API_KEY;

// GNews topic slugs map to our category names
const CATEGORY_MAP = {
  general:       'general',
  technology:    'technology',
  business:      'business',
  sports:        'sports',
  health:        'health',
  science:       'science',
  entertainment: 'entertainment',
};

async function apiFetch(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error(
      'GNEWS_API_KEY is not set. Get a free key at https://gnews.io and add it to .env.local'
    );
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.set(key, val);
    }
  });

  const res = await fetch(url.toString());

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.errors?.[0] || `HTTP ${res.status} from GNews`);
  }

  return res.json();
}

/**
 * Fetch top headlines by category.
 */
export async function getTopHeadlines({ category = 'general', pageSize = 10 } = {}) {
  const topic = CATEGORY_MAP[category] || 'general';
  return apiFetch('/top-headlines', {
    topic,
    lang: 'en',
    max: Math.min(Number(pageSize), 10), // GNews free tier max is 10
  });
}

/**
 * Search articles — used for the search feature.
 */
export async function searchArticles({ query, pageSize = 10, page = 1, sortBy = 'publishedAt' } = {}) {
  const sortMap = { publishedAt: 'publishedAt', relevancy: 'relevance', popularity: 'publishedAt' };
  return apiFetch('/search', {
    q: query,
    lang: 'en',
    max: Math.min(Number(pageSize), 10),
    from: page > 1 ? getPageFrom(page, 10) : undefined,
    sortby: sortMap[sortBy] || 'publishedAt',
  });
}

function getPageFrom(page, pageSize) {
  // GNews uses date-based pagination; simulate offset with a past date string
  const d = new Date();
  d.setDate(d.getDate() - (page - 1) * 2);
  return d.toISOString();
}

/**
 * Format a raw GNews article into the same shape the UI expects.
 * GNews shape: { title, description, content, url, image, publishedAt, source: { name, url } }
 */
export function formatArticle(article) {
  return {
    title: article.title || 'Untitled',
    description: article.description || '',
    url: article.url || '#',
    imageUrl: article.image || null,
    source: article.source?.name || 'Unknown',
    sourceId: null,
    publishedAt: article.publishedAt || null,
    author: null,
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
