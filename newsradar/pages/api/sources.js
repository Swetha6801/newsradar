/**
 * API Route: /api/sources
 *
 * Returns available news sources, optionally filtered by category.
 *
 * Query params:
 *   ?category=technology|business|sports|...
 */

import { getSources } from '../../lib/newsApi';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category } = req.query;

  try {
    const data = await getSources({ category });

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache 1hr

    return res.status(200).json({
      status: 'ok',
      sources: data.sources || [],
    });
  } catch (err) {
    console.error('[/api/sources]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
