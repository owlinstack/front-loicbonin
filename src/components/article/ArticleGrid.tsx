'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import type { Article } from '@/lib/types'
import { getArticles } from '@/lib/api'
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
  const [articles, setArticles] = useState<Article[]>(listArticles)
  const [currentPage, setCurrentPage] = useState<number>(page)
  const [hasMoreState, setHasMoreState] = useState<boolean>(hasMore)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const loadNextPage = useCallback(async () => {
    if (isLoading || !hasMoreState) return
    setIsLoading(true)

    try {
      const nextPage = currentPage + 1
      const isBrowsingAll = activeCategory === 'all' && !activeTag
      const res = await getArticles({
        category: activeCategory,
        tag: activeTag,
        page: nextPage,
        pageSize: 10,
        is_pinned: isBrowsingAll ? false : undefined,
      })

      if (res && res.articles) {
        setArticles((prev) => {
          // Prevent duplicates just in case
          const existingIds = new Set(prev.map((a) => a.id))
          const uniqueNew = res.articles.filter((a) => !existingIds.has(a.id))
          return [...prev, ...uniqueNew]
        })
        setCurrentPage(nextPage)
        setHasMoreState(res.total > nextPage * 10)
      } else {
        setHasMoreState(false)
      }
    } catch (err) {
      console.error('[Infinite Scroll] Failed to load next page:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMoreState, currentPage, activeCategory, activeTag])

  useEffect(() => {
    if (!hasMoreState) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMoreState, loadNextPage])

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

      {articles.length === 0 && !featuredArticle ? (
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
          {articles.map((article, index) => (
            <div key={article.id}>
              {index > 0 && <hr className="hr-rule" style={{ marginTop: 40, marginBottom: 40 }} />}
              <div style={{ paddingBottom: 16 }}>
                <ArticleCard article={article} />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMoreState && (
        <div ref={loadMoreRef} className="load-more-trigger">
          {isLoading && <span className="loader">Chargement...</span>}
        </div>
      )}

      <style>{`
        .load-more-trigger {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 64px;
          padding: 16px 0;
          margin-top: 24px;
        }
        .loader {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
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
