import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CATEGORIES = [
  { label: 'Top', value: 'general' },
  { label: 'Tech', value: 'technology' },
  { label: 'Business', value: 'business' },
  { label: 'Sports', value: 'sports' },
  { label: 'Health', value: 'health' },
  { label: 'Science', value: 'science' },
  { label: 'Entertainment', value: 'entertainment' },
];

export default function Navbar() {
  const router = useRouter();
  const currentCategory = router.query.category || 'general';
  const [searchVal, setSearchVal] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.inner} className="container">
        {/* Logo */}
        <Link href="/" style={styles.logo}>
          <span style={styles.logoAccent}>News</span>Radar
        </Link>

        {/* Category links — desktop */}
        <ul style={styles.catList}>
          {CATEGORIES.map((cat) => (
            <li key={cat.value}>
              <Link
                href={`/?category=${cat.value}`}
                style={{
                  ...styles.catLink,
                  ...(currentCategory === cat.value && router.pathname === '/' ? styles.catActive : {}),
                }}
              >
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="search"
            placeholder="Search news…"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            style={styles.searchInput}
            aria-label="Search news"
          />
          <button type="submit" style={styles.searchBtn} aria-label="Submit search">
            ↗
          </button>
        </form>

        {/* Sources link */}
        <Link href="/sources" style={styles.sourcesLink}>
          Sources
        </Link>
      </div>

      {/* Mobile category strip */}
      <div style={styles.mobileStrip} className="container">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={`/?category=${cat.value}`}
            style={{
              ...styles.mobileCat,
              ...(currentCategory === cat.value && router.pathname === '/' ? styles.mobileCatActive : {}),
            }}
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#0f0f0f',
    color: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid #222',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    height: '56px',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    color: '#ffffff',
    flexShrink: 0,
  },
  logoAccent: {
    color: '#e63946',
  },
  catList: {
    display: 'flex',
    gap: '0.25rem',
    listStyle: 'none',
    flexShrink: 0,
    // hidden on mobile via mobileStrip
    '@media (max-width: 768px)': { display: 'none' },
  },
  catLink: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#aaaaaa',
    padding: '4px 10px',
    borderRadius: '4px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    transition: 'color 0.15s',
  },
  catActive: {
    color: '#ffffff',
    background: '#1f1f1f',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    maxWidth: '280px',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    overflow: 'hidden',
    marginLeft: 'auto',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#ffffff',
    fontSize: '0.875rem',
    padding: '7px 10px',
    flex: 1,
    fontFamily: 'inherit',
  },
  searchBtn: {
    background: '#e63946',
    border: 'none',
    color: '#fff',
    padding: '7px 12px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  sourcesLink: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#aaaaaa',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    flexShrink: 0,
  },
  mobileStrip: {
    display: 'flex',
    gap: '0.25rem',
    paddingBottom: '8px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  mobileCat: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#888',
    padding: '3px 10px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    flexShrink: 0,
  },
  mobileCatActive: {
    color: '#fff',
    background: '#1f1f1f',
  },
};
