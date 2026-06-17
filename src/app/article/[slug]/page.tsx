import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArticleProse } from '@/components/article/ArticleProse'
import { AssociatedCodeSection } from '@/components/article/AssociatedCodeSection'
import { ReadingProgress } from '@/components/ui/ReadingProgress'
import { getArticleBySlug } from '@/lib/api'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://loicbonin.com'
  const url = `${baseUrl}/article/${slug}`

  if (!article) {
    return {
      title: "Article non trouvé",
      description: "L'article demandé n'existe pas ou a été retiré.",
      robots: {
        index: false,
        follow: true,
      },
    }
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: url,
      siteName: 'Loïc Bonin',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: ['Loïc Bonin'],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        <Header />
        <main
          style={{
            maxWidth: 680,
            margin: '0 auto',
            padding: '56px 24px 96px',
            textAlign: 'center',
            paddingTop: 96,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-muted)',
            }}
          >
            Article introuvable.
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Loïc Bonin',
      url: 'https://loicbonin.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Loïc Bonin',
      logo: {
        '@type': 'ImageObject',
        url: 'https://loicbonin.com/avatar.jpg', // fallback image path
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://loicbonin.com/article/${article.slug}`,
    },
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ReadingProgress />
      <Header />

      <main
        style={{
          maxWidth: 680,
          margin: '0 auto',
          padding: '56px 24px 96px',
        }}
      >
        {/* Back link */}
        <div style={{ marginBottom: 40 }}>
          <Link
            href="/"
            className="back-link"
          >
            ← Veille
          </Link>
        </div>

        {/* Category */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: 16,
          }}
        >
          {article.category}
        </p>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(var(--text-xl), 4vw, var(--text-hero))',
            fontWeight: 400,
            color: 'var(--color-text)',
            lineHeight: 1.05,
            marginBottom: 32,
            letterSpacing: '-0.01em',
          }}
        >
          {article.title}
        </h1>

        {/* Metadata */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.04em',
            marginBottom: 32,
          }}
        >
          {formatDate(article.publishedAt)}
          <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
          {article.readingTime} min de lecture
        </p>

        <hr
          style={{
            border: 'none',
            borderTop: '1px solid var(--color-border)',
            marginBottom: 48,
          }}
        />

        {/* Prose */}
        <ArticleProse content={article.content} />

        {/* Code source associé dépliable */}
        <AssociatedCodeSection article={article} />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <hr
              style={{
                border: 'none',
                borderTop: '1px solid var(--color-border)',
                marginBottom: 24,
              }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${tag}`}
                  className="tag-chip"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style>{`
        .back-link {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          text-decoration: none;
          transition: color 150ms;
        }
        .back-link:hover {
          color: var(--color-text);
        }
      `}</style>
    </div>
  )
}
