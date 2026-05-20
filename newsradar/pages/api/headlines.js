/**
 * API Route: /api/headlines
 *
 * Demonstrates Next.js API Routes — this runs ONLY on the server.
 * The client never sees the API key; it only talks to this internal endpoint.
 *
 * Query params:
 *   ?category=technology|business|sports|health|science|entertainment|general
 *   ?country=in (default: India)
 *   ?pageSize=20
 */

import { getTopHeadlines, formatArticle } from '../../lib/newsApi';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category = 'general', country = 'in', pageSize = 20 } = req.query;

  // Validate category
  const validCategories = ['general', 'technology', 'business', 'sports', 'health', 'science', 'entertainment'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: `Invalid category. Choose from: ${validCategories.join(', ')}` });
  }

  try {
    const data = await getTopHeadlines({
      category,
      country,
      pageSize: Math.min(Number(pageSize), 100), // NewsAPI max is 100
    });

    const articles = (data.articles || []).map(formatArticle);

    // Cache for 5 minutes on the CDN/browser
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(200).json({
      status: 'ok',
      category,
      totalResults: data.totalResults,
      articles,
    });
  } catch (err) {
    console.error('[/api/headlines]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
