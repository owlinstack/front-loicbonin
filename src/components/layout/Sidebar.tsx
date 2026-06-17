import Link from "next/link";
import type { Category, Tag } from "@/lib/types";
import { TagPanel } from "@/components/ui/TagPanel";

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  activeCategory?: string;
  activeTag?: string;
}

export function Sidebar({
  categories,
  tags,
  activeCategory = "all",
  activeTag,
}: SidebarProps) {
  const visibleCategories = categories.filter((c) => c.count > 0);

  return (
    <aside
      aria-label="Filtres"
      style={{
        width: 220,
        flexShrink: 0,
        position: "sticky",
        top: 80,
        alignSelf: "flex-start",
        paddingTop: 8,
      }}
    >
      {/* Site name */}
      <Link href="/" className="sidebar-logo-link">
        Veille
      </Link>

      {/* Categories */}
      <nav aria-label="Catégories">
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: 0,
            margin: 0,
          }}
        >
          {visibleCategories.map((cat) => {
            const active = activeCategory === cat.slug;
            const targetHref =
              cat.slug === "all" ? "/" : `/?category=${cat.slug}`;
            return (
              <li key={cat.slug}>
                <Link
                  href={targetHref}
                  aria-current={active ? "page" : undefined}
                  className={`sidebar-category-link${active ? " active" : ""}`}
                >
                  {active && (
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "var(--color-accent)",
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    />
                  )}
                  {!active && (
                    <span
                      style={{ width: 3, flexShrink: 0 }}
                      aria-hidden="true"
                    />
                  )}
                  {cat.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tag panel */}
      <TagPanel
        tags={tags}
        activeCategory={activeCategory}
        activeTag={activeTag}
      />

      <style>{`
        .sidebar-logo-link {
          font-family: var(--font-sans);
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          display: block;
          margin-bottom: 32px;
          letter-spacing: 0;
          font-weight: 400;
          transition: color 150ms;
          text-decoration: none;
        }
        .sidebar-logo-link:hover {
          color: var(--color-text);
        }
        .sidebar-category-link {
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          padding: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: color 150ms;
          text-align: left;
          width: 100%;
          text-decoration: none;
        }
        .sidebar-category-link.active {
          color: var(--color-text);
        }
        .sidebar-category-link:hover {
          color: var(--color-text);
        }
      `}</style>
    </aside>
  );
}
