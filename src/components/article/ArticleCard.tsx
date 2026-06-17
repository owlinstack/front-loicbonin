import Link from 'next/link'
import type { Article } from '@/lib/types'

interface ArticleCardProps {
  article: Article
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return 'Non publié'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article
      aria-label={article.title}
      className="article-card-container"
    >
      <Link
        href={`/article/${article.slug}`}
        style={{ display: 'block', textDecoration: 'none' }}
        className="article-card"
      >
        {/* Category and Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text)',
              fontWeight: 500,
            }}
          >
            {article.category}
          </span>
          {article.tags && article.tags.length > 0 && (
            <>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', opacity: 0.5 }}>·</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                      padding: '2px 6px',
                      borderRadius: '2px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Title */}
        <h2
          className="article-card-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-lg)',
            fontWeight: 400,
            color: 'var(--color-text)',
            lineHeight: 1.15,
            marginBottom: 14,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.title}
        </h2>

        {/* Excerpt */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.7,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          {article.excerpt}
        </p>

        {/* Metadata */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.04em',
          }}
        >
          {formatDate(article.publishedAt)}
          <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
          {article.readingTime} min de lecture
        </p>
      </Link>

      <style>{`
        .article-card-container {
          background-color: transparent;
          transition: background-color 150ms;
          padding: 24px;
          margin: -24px;
          border-radius: 4px;
        }
        .article-card-container:hover {
          background-color: var(--color-surface);
        }
      `}</style>
    </article>
  )
}
