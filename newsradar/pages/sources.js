/**
 * Sources Page — /sources
 *
 * Demonstrates: getStaticProps (ISR — Incremental Static Regeneration).
 * GNews does not have a sources endpoint, so we use a curated static list.
 * The page is pre-built at deploy time — fast loads, no API call needed.
 */

import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const SOURCES = [
  { id: 'bbc-news',            name: 'BBC News',           category: 'general',       description: 'Breaking news, features and analysis from the BBC.' },
  { id: 'reuters',             name: 'Reuters',            category: 'general',       description: 'International news from Reuters, the news and media division of Thomson Reuters.' },
  { id: 'cnn',                 name: 'CNN',                category: 'general',       description: 'View the latest news and breaking news today for U.S., world, weather, entertainment, politics and health.' },
  { id: 'the-guardian-uk',     name: 'The Guardian',       category: 'general',       description: 'Latest news, sport, business, comment, analysis and reviews from the Guardian.' },
  { id: 'techcrunch',          name: 'TechCrunch',         category: 'technology',    description: 'TechCrunch is a leading technology media property covering startups and Silicon Valley.' },
  { id: 'wired',               name: 'Wired',              category: 'technology',    description: 'In-depth coverage of current and future trends in technology.' },
  { id: 'the-verge',           name: 'The Verge',          category: 'technology',    description: 'Covers the intersection of technology, science, art, and culture.' },
  { id: 'ars-technica',        name: 'Ars Technica',       category: 'technology',    description: 'The PC enthusiast\'s resource: technology news, reviews, and analysis.' },
  { id: 'bloomberg',           name: 'Bloomberg',          category: 'business',      description: 'Bloomberg delivers business and markets news, data, analysis, and video.' },
  { id: 'business-insider',    name: 'Business Insider',   category: 'business',      description: 'Business Insider is a fast-growing business site with deep financial, media, tech, and other industry verticals.' },
  { id: 'fortune',             name: 'Fortune',            category: 'business',      description: 'Fortune 500 daily and breaking business news and analysis.' },
  { id: 'espn',                name: 'ESPN',               category: 'sports',        description: 'ESPN has up-to-the-minute sports news coverage, scores, highlights and commentary.' },
  { id: 'nfl-news',            name: 'NFL News',           category: 'sports',        description: 'The official source for NFL news, video highlights, fantasy football, game-day coverage and more.' },
  { id: 'medical-news-today',  name: 'Medical News Today', category: 'health',        description: 'Medical news and health news headlines posted throughout the day, every day.' },
  { id: 'new-scientist',       name: 'New Scientist',      category: 'science',       description: 'New Scientist covers the latest developments in science and technology.' },
  { id: 'national-geographic', name: 'National Geographic', category: 'science',     description: 'Reporting our world daily: original nature and science news.' },
  { id: 'entertainment-weekly', name: 'Entertainment Weekly', category: 'entertainment', description: 'The latest movie, music, TV and book reviews, interviews and entertainment news.' },
  { id: 'mtv-news',            name: 'MTV News',           category: 'entertainment', description: 'The latest music news, videos and photos from MTV News.' },
];

const CATEGORIES = ['all', 'general', 'technology', 'business', 'sports', 'health', 'science', 'entertainment'];

export default function SourcesPage({ sources }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = sources.filter((s) => {
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
              Browse popular sources. Click any to see its latest headlines.
            </p>
          </div>
          <div style={styles.badge}>
            ISR · statically generated
          </div>
        </div>

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

        <p style={styles.count}>{filtered.length} sources</p>

        <div style={styles.grid}>
          {filtered.map((source) => (
            <Link
              key={source.id}
              href={`/news/${encodeURIComponent(source.name)}`}
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
      </div>

      <style>{`
        .source-card { transition: box-shadow 0.2s, transform 0.2s; }
        .source-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
      `}</style>
    </Layout>
  );
}

// getStaticProps with ISR — pre-built at deploy time, no API call needed
export async function getStaticProps() {
  return {
    props: { sources: SOURCES },
    revalidate: 86400, // regenerate once a day
  };
}

const styles = {
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '1.5rem 0 1rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em', color: '#111', marginBottom: '4px' },
  subtitle: { color: '#666', fontSize: '0.875rem' },
  badge: { background: '#f0ede8', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '4px 12px', fontSize: '0.75rem', color: '#666', fontFamily: 'monospace', letterSpacing: '0.03em', alignSelf: 'flex-start' },
  controls: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' },
  filterInput: { border: '1px solid #e5e5e5', borderRadius: '8px', padding: '10px 14px', fontSize: '0.875rem', fontFamily: 'inherit', color: '#111', background: '#fff', maxWidth: '320px', outline: 'none' },
  cats: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  catBtn: { padding: '5px 14px', borderRadius: '999px', border: '1px solid #e5e5e5', background: '#f5f4f0', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', color: '#444', transition: 'background 0.15s' },
  catBtnActive: { background: '#0f0f0f', color: '#fff', borderColor: '#0f0f0f' },
  count: { fontSize: '0.8rem', color: '#999', marginBottom: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' },
  card: { display: 'flex', flexDirection: 'column', gap: '8px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', padding: '1rem 1.25rem', color: 'inherit' },
  cardTop: { display: 'flex', alignItems: 'center', gap: '10px' },
  sourceInitial: { width: '36px', height: '36px', borderRadius: '8px', background: '#0f0f0f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem', flexShrink: 0 },
  sourceName: { fontWeight: '600', fontSize: '0.9rem', color: '#111', marginBottom: '2px' },
  sourceCat: { fontSize: '0.7rem', color: '#e63946', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.04em' },
  sourceDesc: { fontSize: '0.8rem', color: '#666', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  viewLink: { fontSize: '0.8rem', color: '#e63946', fontWeight: '500', marginTop: 'auto' },
  empty: { color: '#888', textAlign: 'center', padding: '2rem 0' },
};
