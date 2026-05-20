import { timeAgo } from '../lib/newsApi';

/**
 * ArticleCard — displays a single news article.
 * Supports two variants: 'featured' (large hero card) and 'normal' (compact grid card).
 */
export default function ArticleCard({ article, variant = 'normal' }) {
  const { title, description, url, imageUrl, source, publishedAt } = article;
  const timeLabel = timeAgo(publishedAt);

  if (variant === 'featured') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" style={featuredStyles.card}>
        <div style={{ ...featuredStyles.image, ...(imageUrl ? {} : { background: '#1a1a1a' }) }}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} style={featuredStyles.img} onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <span style={featuredStyles.imgFallback}>📰</span>
          )}
          <div style={featuredStyles.overlay} />
          <div style={featuredStyles.overlayContent}>
            <span style={featuredStyles.sourceTag}>{source}</span>
            <h2 style={featuredStyles.title}>{title}</h2>
            {description && <p style={featuredStyles.desc}>{description}</p>}
            <span style={featuredStyles.time}>{timeLabel}</span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={cardStyles.card} className="article-card">
      {imageUrl && (
        <div style={cardStyles.imageWrap}>
          <img src={imageUrl} alt={title} style={cardStyles.img} onError={(e) => { e.target.parentNode.style.display = 'none'; }} />
        </div>
      )}
      <div style={cardStyles.body}>
        <div style={cardStyles.meta}>
          <span style={cardStyles.source}>{source}</span>
          {timeLabel && <span style={cardStyles.time}>{timeLabel}</span>}
        </div>
        <h3 style={cardStyles.title}>{title}</h3>
        {description && <p style={cardStyles.desc}>{description}</p>}
      </div>
      <style>{`
        .article-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); transform: translateY(-2px); }
        .article-card { transition: box-shadow 0.2s, transform 0.2s; }
      `}</style>
    </a>
  );
}

const featuredStyles = {
  card: {
    display: 'block',
    borderRadius: '12px',
    overflow: 'hidden',
    height: '420px',
    position: 'relative',
    background: '#111',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  imgFallback: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    fontSize: '4rem',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
  },
  overlayContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '1.5rem',
  },
  sourceTag: {
    display: 'inline-block',
    background: '#e63946',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '3px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  title: {
    color: '#ffffff',
    fontSize: '1.4rem',
    fontWeight: '700',
    lineHeight: '1.3',
    marginBottom: '0.5rem',
  },
  desc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    marginBottom: '0.75rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  time: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.75rem',
  },
};

const cardStyles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #e5e5e5',
  },
  imageWrap: {
    aspectRatio: '16/9',
    overflow: 'hidden',
    background: '#f0ede8',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
    display: 'block',
  },
  body: {
    padding: '1rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  source: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#e63946',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  time: {
    fontSize: '0.7rem',
    color: '#999',
  },
  title: {
    fontSize: '0.95rem',
    fontWeight: '600',
    lineHeight: '1.4',
    color: '#111',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  desc: {
    fontSize: '0.825rem',
    color: '#666',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    marginTop: '2px',
  },
};
