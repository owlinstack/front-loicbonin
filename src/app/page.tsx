import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { Aside } from "@/components/layout/Aside";
import { ArticleGrid } from "@/components/article/ArticleGrid";
import { getArticles, getCategories, getTags } from "@/lib/api";

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams.category ?? "all";
  const activeTag = resolvedSearchParams.tag;
  const pageNum = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;

  const categoriesData = await getCategories();
  const tagsData = await getTags();
  
  // We load all articles up to the current page on the server so "Load More" appends them
  const articlesData = await getArticles({
    category: activeCategory,
    tag: activeTag,
    page: 1,
    pageSize: pageNum * 10,
  });

  const articles = articlesData.articles;
  const isBrowsingAll = pageNum === 1 && !activeTag && activeCategory === "all";
  const featuredArticle = isBrowsingAll
    ? (articles.find((a) => a.featured) ?? articles[0] ?? null)
    : null;
  const listArticles = featuredArticle
    ? articles.filter((a) => a.id !== featuredArticle.id)
    : articles;

  const hasMore = articlesData.total > pageNum * 10;

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main style={{ display: 'flex', maxWidth: 1140, margin: '0 auto', padding: '48px 24px', gap: 64, alignItems: 'start' }}>
        {/* Sidebar — hidden on mobile */}
        <div className="sidebar-wrap">
          <Sidebar
            categories={categoriesData}
            tags={tagsData}
            activeCategory={activeCategory}
            activeTag={activeTag}
          />
        </div>

        {/* Article list — center column */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 680, margin: '0 auto' }}>
          <ArticleGrid
            featuredArticle={featuredArticle}
            listArticles={listArticles}
            hasMore={hasMore}
            page={pageNum}
            activeCategory={activeCategory}
            activeTag={activeTag}
          />
        </div>

        {/* Right aside — large screens only */}
        <div className="aside-wrap">
          <Aside />
        </div>
      </main>

      <Footer />

      <style>{`
        .sidebar-wrap { display: none; }
        .aside-wrap   { display: none; }
        @media (min-width: 900px)  { .sidebar-wrap { display: block; } }
        @media (min-width: 1100px) { .aside-wrap   { display: block; } }
      `}</style>
    </div>
  );
}
