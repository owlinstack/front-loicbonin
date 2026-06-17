import Link from 'next/link'
import type { Article } from '@/lib/types'
import { ArticleCard } from './ArticleCard'
import { ArticleFeatured } from './ArticleFeatured'

interface ArticleGridProps {
  featuredArticle: Article | null
  listArticles: Article[]
  hasMore: boolean
  page: number
  activeCategory?: string
  activeTag?: string
}

export function ArticleGrid({
  featuredArticle,
  listArticles,
  hasMore,
  page,
  activeCategory = 'all',
  activeTag,
}: ArticleGridProps) {
  const categoryResetHref = activeTag ? `/?tag=${activeTag}` : '/'
  const tagResetHref = activeCategory === 'all' ? '/' : `/?category=${activeCategory}`

  return (
    <>
      {/* Active filters header */}
      {((activeCategory !== 'all') || activeTag) && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 12,
            marginBottom: 32,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
          }}
        >
          <span>Filtre actif :</span>
          {activeCategory !== 'all' && (
            <Link
              href={categoryResetHref}
              className="filter-reset-link"
            >
              Catégorie: {activeCategory} <span style={{ opacity: 0.5 }}>×</span>
            </Link>
          )}
          {activeTag && (
            <Link
              href={tagResetHref}
              className="filter-reset-link"
            >
              Tag: #{activeTag} <span style={{ opacity: 0.5 }}>×</span>
            </Link>
          )}
        </div>
      )}

      {featuredArticle && (
        <>
          <ArticleFeatured article={featuredArticle} />
          <hr className="hr-rule" style={{ marginTop: 16, marginBottom: 40 }} />
        </>
      )}

      {listArticles.length === 0 && !featuredArticle ? (
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            paddingTop: 64,
          }}
        >
          Aucun article trouvé pour cette recherche.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {listArticles.map((article, index) => (
            <div key={article.id}>
              {index > 0 && <hr className="hr-rule" style={{ marginTop: 40, marginBottom: 40 }} />}
              <div style={{ paddingBottom: 16 }}>
                <ArticleCard article={article} />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div style={{ textAlign: 'center', paddingTop: 24 }}>
          <Link
            href={`/?category=${activeCategory}${activeTag ? `&tag=${activeTag}` : ''}&page=${page + 1}`}
            className="load-more-link"
          >
            Charger la suite →
          </Link>
        </div>
      )}

      <style>{`
        .load-more-link {
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          letter-spacing: 0.04em;
          color: var(--color-text-muted);
          padding: 0;
          transition: color 150ms;
          text-decoration: none;
          display: inline-block;
        }
        .load-more-link:hover {
          color: var(--color-text);
          text-decoration: underline;
        }
        .filter-reset-link {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-text);
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
      `}</style>
    </>
  )
}
