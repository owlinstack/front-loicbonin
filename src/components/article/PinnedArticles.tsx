"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Pin, Minimize2, Maximize2 } from 'lucide-react'
import type { Article } from '@/lib/types'

interface PinnedArticlesProps {
  articles: Article[]
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return 'Non publié'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function PinnedArticles({ articles }: PinnedArticlesProps) {
  const [isCarouselMobile, setIsCarouselMobile] = useState(false)

  if (articles.length === 0) return null

  return (
    <section className="pinned-articles-section" aria-label="Articles épinglés" style={{ marginBottom: 48 }}>
      {/* Title Header with Collapse/Expand Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Pin style={{ width: 16, height: 16, transform: 'rotate(45deg)', color: 'var(--color-teal)' }} />
          <h2
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
            }}
          >
            Articles épinglés
          </h2>
        </div>

        {/* Button shown on mobile only to toggle between vertical list and carousel */}
        <button
          onClick={() => setIsCarouselMobile(!isCarouselMobile)}
          className="mobile-toggle-view-btn"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            background: 'none',
            border: 'none',
            padding: '4px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          {isCarouselMobile ? (
            <>
              <Maximize2 style={{ width: 12, height: 12 }} />
              Dérouler
            </>
          ) : (
            <>
              <Minimize2 style={{ width: 12, height: 12 }} />
              Réduire
            </>
          )}
        </button>
      </div>

      {/* Grid or Horizontal scroll wrapper depending on layout state */}
      <div className={`pinned-articles-container ${isCarouselMobile ? 'carousel-mode' : 'list-mode'}`}>
        {articles.map((article) => (
          <article key={article.id} className="pinned-article-item">
            <Link href={`/article/${article.slug}`} className="pinned-article-link">
              {/* Category */}
              <span className="pinned-article-category">
                {article.categories && article.categories.length > 0 ? article.categories.join(' / ') : article.category}
              </span>

              {/* Title */}
              <h3 className="pinned-article-title">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="pinned-article-excerpt">
                {article.excerpt}
              </p>

              {/* Meta */}
              <p className="pinned-article-meta">
                {formatDate(article.publishedAt)}
                <span style={{ margin: '0 6px', opacity: 0.4 }}>·</span>
                {article.readingTime} min de lecture
              </p>
            </Link>
          </article>
        ))}
      </div>

      <style>{`
        /* Default layout: Vertical stack list of full-width items */
        .pinned-articles-container.list-mode {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pinned-article-item {
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 24px;
          transition: border-color 150ms, background-color 150ms, transform 150ms;
        }

        .pinned-article-item:hover {
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-1px);
        }

        [data-theme='light'] .pinned-article-item:hover {
          border-color: rgba(0, 0, 0, 0.18);
        }

        .pinned-article-link {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
        }

        .pinned-article-category {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-teal);
          font-weight: 600;
          margin-bottom: 8px;
        }

        .pinned-article-title {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 450;
          color: var(--color-text);
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .pinned-article-excerpt {
          font-family: var(--font-sans);
          font-size: var(--text-base);
          color: var(--color-text-muted);
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .pinned-article-meta {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          letter-spacing: 0.04em;
        }

        /* Responsive button visibility: toggle button is mobile/tablet only */
        .mobile-toggle-view-btn {
          display: none !important;
        }

        @media (max-width: 768px) {
          .mobile-toggle-view-btn {
            display: flex !important;
          }
        }

        /* Carousel mode (activated only on mobile if toggled) */
        @media (max-width: 768px) {
          .pinned-articles-container.carousel-mode {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none; /* Firefox */
            margin-right: -24px;
            margin-left: -24px;
            padding-right: 24px;
            padding-left: 24px;
            gap: 16px;
          }

          .pinned-articles-container.carousel-mode::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
          }

          .pinned-articles-container.carousel-mode .pinned-article-item {
            flex: 0 0 85%;
            scroll-snap-align: start;
            padding: 20px;
          }

          .pinned-articles-container.carousel-mode .pinned-article-title {
            font-size: var(--text-sm);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .pinned-articles-container.carousel-mode .pinned-article-excerpt {
            font-size: 13px;
            line-height: 1.6;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      `}</style>
    </section>
  )
}
