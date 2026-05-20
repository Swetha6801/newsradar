import Link from 'next/link';
import { useRouter } from 'next/router';

const CATEGORIES = [
  { label: '🌐 General', value: 'general' },
  { label: '💻 Technology', value: 'technology' },
  { label: '📈 Business', value: 'business' },
  { label: '⚽ Sports', value: 'sports' },
  { label: '🏥 Health', value: 'health' },
  { label: '🔬 Science', value: 'science' },
  { label: '🎬 Entertainment', value: 'entertainment' },
];

export default function CategoryBar({ active }) {
  return (
    <div style={styles.wrap}>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.value}
          href={`/?category=${cat.value}`}
          style={{
            ...styles.pill,
            ...(active === cat.value ? styles.pillActive : {}),
          }}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    padding: '1.25rem 0 0.5rem',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 14px',
    borderRadius: '999px',
    fontSize: '0.825rem',
    fontWeight: '500',
    background: '#f0ede8',
    color: '#444',
    border: '1px solid #e5e5e5',
    transition: 'background 0.15s, color 0.15s',
  },
  pillActive: {
    background: '#0f0f0f',
    color: '#ffffff',
    border: '1px solid #0f0f0f',
  },
};
