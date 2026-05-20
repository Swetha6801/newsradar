/**
 * API Route: /api/search
 *
 * Powers the search feature. Demonstrates how Next.js API routes
 * act as a secure proxy — the browser never touches NewsAPI directly.
 *
 * Query params:
 *   ?q=your+search+query (required)
 *   ?page=1
 *   ?sortBy=publishedAt|relevancy|popularity
 */

import { searchArticles, formatArticle } from '../../lib/newsApi';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, page = 1, sortBy = 'publishedAt' } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Query param "q" must be at least 2 characters.' });
  }

  const validSortBy = ['publishedAt', 'relevancy', 'popularity'];
  if (!validSortBy.includes(sortBy)) {
    return res.status(400).json({ error: `Invalid sortBy. Choose from: ${validSortBy.join(', ')}` });
  }

  try {
    const data = await searchArticles({
      query: q.trim(),
      page: Number(page),
      sortBy,
      pageSize: 20,
    });

    const articles = (data.articles || []).map(formatArticle);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    return res.status(200).json({
      status: 'ok',
      query: q,
      totalResults: data.totalResults,
      page: Number(page),
      articles,
    });
  } catch (err) {
    console.error('[/api/search]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
