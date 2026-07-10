import type {
  Article,
  Category,
  CodeTree,
  CodeFile,
  PaginatedArticles,
  Profile,
  Project,
  Tag,
  CodeProject,
} from "./types";
import { z } from "zod";
import {
  ArticleSchema,
  CategorySchema,
  ProjectSchema,
  CodeFileSchema,
  CodeTreeSchema,
  ProfileSchema,
  PaginatedArticlesSchema,
  CodeProjectSchema,
} from "./validation";

// Simplification: Mock de données en mémoire.
// Plafond: Les données sont statiques et chargées en local sans persistance ni synchronisation réelle.
// Plan d'évolution: Remplacer ce mock par des appels asynchrones avec fetch natif vers l'API REST de production.
const MOCK_ARTICLES: Article[] = [
  {
    id: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
    slug: "rethinking-react-server-components",
    title: "Lorem ipsum dolor sit amet",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    content: `## Dolor sit amet
    
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Consectetur adipiscing elit

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

* Lorem ipsum dolor sit amet
* Consectetur adipiscing elit
* Sed do eiusmod tempor incididunt

## Sed do eiusmod tempor

Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.`,
    category: "react",
    tags: ["react", "nextjs", "rsc", "performance"],
    publishedAt: "2026-06-10",
    readingTime: 7,
    featured: true,
  },
  {
    id: "01H7B3Q9N8472M6YV6N7R0G5Y1",
    slug: "type-safe-api-zod",
    title: "Consectetur adipiscing elit",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    content: `## Quis nostrud exercitation

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Duis aute irure dolor

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "typescript",
    tags: ["typescript", "php", "api", "validation"],
    publishedAt: "2026-05-28",
    readingTime: 5,
  },
  {
    id: "01H7B3Q9N8472M6YV6N7R0G5Y2",
    slug: "css-view-transitions",
    title: "Sed do eiusmod tempor incididunt",
    excerpt:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    content: `## Ut labore et dolore

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Excepteur sint occaecat

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "css",
    tags: ["css", "animation", "browser", "ux"],
    publishedAt: "2026-05-14",
    readingTime: 4,
  },
  {
    id: "01H7B3Q9N8472M6YV6N7R0G5Y3",
    slug: "drizzle-orm-patterns",
    title: "Ut enim ad minim veniam",
    excerpt:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    content: `## Quis nostrud

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Duis aute irure

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "backend",
    tags: ["drizzle", "sql", "typescript", "backend"],
    publishedAt: "2026-04-30",
    readingTime: 9,
  },
  {
    id: "01H7B3Q9N8472M6YV6N7R0G5Y4",
    slug: "shiki-server-side-highlighting",
    title: "Duis aute irure dolor in reprehenderit",
    excerpt:
      "Mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    content: `## Voluptate velit esse

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Sunt in culpa qui officia

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: "tooling",
    tags: ["nextjs", "performance", "dx"],
    publishedAt: "2026-04-12",
    readingTime: 6,
  },
];

const MOCK_CATEGORIES: Category[] = [
  { slug: "all", label: "Tout", count: 5 },
  { slug: "react", label: "React", count: 1 },
  { slug: "typescript", label: "TypeScript", count: 1 },
  { slug: "css", label: "CSS", count: 1 },
  { slug: "backend", label: "Backend", count: 1 },
  { slug: "tooling", label: "Tooling", count: 1 },
];

const MOCK_TAGS: Tag[] = [
  "react",
  "nextjs",
  "php",
  "performance",
  "typescript",
  "zod",
  "api",
  "validation",
  "css",
  "animation",
  "browser",
  "ux",
  "drizzle",
  "sql",
  "backend",
  "laravel",
  "dx",
];

const MOCK_PROJECTS: Project[] = [
  {
    id: "01H7B3Q9N8472M6YV6N7R0G5Z1",
    slug: "jpprat-livres",
    title: "Jean-Paul Prat Livres",
    description:
      "Conception d'une plateforme e-commerce autonome couplant Next.js et PayloadCMS, implémentation sécurisée du tunnel d'achat (Stripe) sur serveur dédié (Debian).",
    techStack: ["Next.js", "PayloadCMS", "Stripe"],
    liveUrl: "https://jpprat-livres.fr",
    featured: true,
    year: "2024",
  },
  {
    id: "01H7B3Q9N8472M6YV6N7R0G5Z2",
    slug: "fleur-bleue",
    title: "Fleur Bleue",
    description:
      "Réalisation d'une application web sous Next.js interconnectée avec l'API REST de Wix et gestion complète de l'infrastructure d'hébergement.",
    techStack: ["Next.js", "Wix API"],
    liveUrl: "https://agencefleurbleue.fr",
    year: "2023",
  },
  {
    id: "01H7B3Q9N8472M6YV6N7R0G5Z3",
    slug: "koniplay",
    title: "Koni Play",
    description:
      "SaaS de Streaming Audio : développement d'un catalogue de diffusion de mes musiques. Architecture Laravel / Vue.js, optimisation de chargement des médias, sécurité et hébergement.",
    techStack: ["Laravel", "Vue.js"],
    liveUrl: "https://koniplay.com",
    year: "2024",
  },
  {
    id: "01H7B3Q9N8472M6YV6N7R0G5Z4",
    slug: "owlinstack",
    title: "Owlinstack",
    description:
      "Refonte Vitrine & Performance Web : modernisation complète sous Next.js. Optimisation du SEO technique, des métriques d'accessibilité (Core Web Vitals) et configuration de l'infrastructure d'hébergement.",
    techStack: ["Next.js", "SEO", "Core Web Vitals"],
    liveUrl: "https://owlinstack.com",
    year: "2025",
  },
  {
    id: "01H7B3Q9N8472M6YV6N7R0G5Z5",
    slug: "solecooler",
    title: "Solecooler",
    description:
      "Lead Dev Fullstack & Architecture (Freelance + CDD) : conception de A à Z et mise en production de la plateforme e-commerce internationale.",
    techStack: ["Sylius", "Symfony", "Twig"],
    liveUrl: "https://solecooler.com",
    year: "2024",
  },
];

const MOCK_CODE_PROJECTS: CodeProject[] = [
  {
    id: "01ARZ3NDEKTSV4RRFFQ69G5FAB",
    name: "Filament Core Project",
    slug: "filament-core-project",
    description: "Un projet regroupant toute l'architecture de base de nos panels d'administration.",
  },
];

const MOCK_CODE_TREE: CodeTree = [
  {
    name: "hooks",
    path: "hooks",
    children: [
      {
        name: "useReadingProgress.ts",
        path: "hooks/useReadingProgress.ts",
        language: "typescript",
        content: `import { useEffect, useState } from 'react'

export function useReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return progress
}`,
        linkedArticleSlug: "css-view-transitions",
        linkedArticleTitle: "The View Transitions API Is Ready",
      },
      {
        name: "useTheme.ts",
        path: "hooks/useTheme.ts",
        language: "typescript",
        content: `import { useCallback, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('lb-theme') as Theme | null
    if (stored) setTheme(stored)
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('lb-theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }, [])

  return [theme, toggle]
}`,
      },
    ],
  },
  {
    name: "lib",
    path: "lib",
    children: [
      {
        name: "api.ts",
        path: "lib/api.ts",
        language: "typescript",
        content: `// Centralised API client with typed return values.

const BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

interface FetchOptions extends RequestInit {
  timeout?: number
}

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { timeout = 8000, ...init } = opts
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(\`\${BASE}\${path}\`, {
      ...init,
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(\`HTTP \${res.status}: \${path}\`)
    return res.json() as Promise<T>
  } finally {
    clearTimeout(id)
  }
}

export const getArticles = (category?: string, page = 1) =>
  apiFetch<Article[]>(\`/api/articles?page=\${page}\${category ? \`&category=\${category}\` : ''}\`)

export const getArticleBySlug = (slug: string) =>
  apiFetch<Article>(\`/api/articles/\${slug}\`)`,
      },
    ],
  },
  {
    name: "styles",
    path: "styles",
    children: [
      {
        name: "tokens.css",
        path: "styles/tokens.css",
        language: "css",
        content: `/* Design Tokens — single source of truth for all visual values */

:root {
  /* Typography */
  --font-display: 'Editorial New', Georgia, serif;
  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;

  /* Fluid type scale */
  --text-xs:   clamp(0.75rem,  0.7rem  + 0.15vw, 0.8125rem);
  --text-sm:   clamp(0.875rem, 0.82rem + 0.20vw, 0.9375rem);
  --text-base: clamp(1.0625rem,1rem    + 0.30vw, 1.1875rem);
  --text-lg:   clamp(1.25rem,  1.1rem  + 0.80vw, 1.75rem);
  --text-xl:   clamp(1.75rem,  1.3rem  + 1.50vw, 2.75rem);
  --text-hero: clamp(2.5rem,   1.5rem  + 3.50vw, 4.5rem);

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Color — dark theme */
  --color-bg:         #0c0c0b;
  --color-surface:    #131312;
  --color-text:       #e8e6e1;
  --color-text-muted: #6b6966;
  --color-border:     rgba(255, 255, 255, 0.07);
  --color-teal:       #01696f;
}

[data-theme='light'] {
  --color-bg:         #f9f8f6;
  --color-surface:    #ffffff;
  --color-text:       #1a1917;
  --color-text-muted: #8a8784;
  --color-border:     rgba(0, 0, 0, 0.08);
}

/* View transitions */
@view-transition { navigation: auto; }`,
        linkedArticleSlug: "css-view-transitions",
        linkedArticleTitle: "The View Transitions API Is Ready",
      },
      {
        name: "prose.css",
        path: "styles/prose.css",
        language: "css",
        content: `/* Article prose — long-form reading experience */

.article-prose {
  font-size: var(--text-base);
  line-height: 1.75;
  max-width: 65ch;
  color: var(--color-text);
}

.article-prose p { margin-bottom: 1.5em; }

.article-prose h2 {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 1.2rem + 0.9vw, 2rem);
  font-weight: 650;
  margin-top: 3.5em;
  margin-bottom: 1em;
  letter-spacing: -0.01em;
}

.article-prose pre {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  margin: 2em 0;
  font-size: var(--text-xs);
}

.article-prose blockquote {
  border-left: 2px solid var(--color-border);
  padding-left: 1.5rem;
  font-style: italic;
  color: var(--color-text-muted);
  margin: 2em 0;
}`,
      },
    ],
  },
  {
    name: "templates",
    path: "templates",
    children: [
      {
        name: "article.html",
        path: "templates/article.html",
        language: "html",
        content: `<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ article.title }} — Loïc Bonin</title>
  <meta name="description" content="{{ article.excerpt }}" />
  <meta property="og:title" content="{{ article.title }}" />
  <meta property="og:type" content="article" />
  <meta property="article:published_time" content="{{ article.publishedAt }}" />
  <link rel="canonical" href="{{ site.url }}/article/{{ article.slug }}" />
  <link rel="stylesheet" href="/styles/tokens.css" />
  <link rel="stylesheet" href="/styles/prose.css" />
</head>
<body>
  <header role="banner">
    <nav aria-label="Navigation principale">
      <a href="/" class="nav-link">Veille</a>
      <a href="/realisations" class="nav-link">Réalisations</a>
      <a href="/code" class="nav-link">Code</a>
      <a href="/profil" class="nav-link">Profil</a>
    </nav>
  </header>

  <main id="main-content">
    <article aria-labelledby="article-title">
      <header>
        <p class="article-meta">
          <time datetime="{{ article.publishedAt }}">{{ article.formattedDate }}</time>
          — {{ article.readingTime }} min de lecture
        </p>
        <h1 id="article-title">{{ article.title }}</h1>
      </header>

      <div class="article-prose">
        {{ article.content | markdown }}
      </div>
    </article>
  </main>

  <footer role="contentinfo">
    <p>&copy; {{ year }} Loïc Bonin</p>
  </footer>
</body>
</html>`,
      },
    ],
  },
  {
    name: "api",
    path: "api",
    children: [
      {
        name: "articles.php",
        path: "api/articles.php",
        language: "php",
        content: `<?php
declare(strict_types=1);

namespace App\\Api;

use App\\Database\\Connection;
use App\\Models\\Article;

class ArticlesController
{
    public function __construct(
        private readonly Connection $db
    ) {}

    public function index(int $page = 1, int $perPage = 10): array
    {
        $offset = ($page - 1) * $perPage;

        $rows = $this->db->query(
            'SELECT * FROM articles
             WHERE published_at <= NOW()
             ORDER BY published_at DESC
             LIMIT ? OFFSET ?',
            [$perPage, $offset]
        );

        return array_map(
            fn(array $row) => Article::fromRow($row),
            $rows
        );
    }

    public function show(string $slug): ?Article
    {
        $row = $this->db->queryOne(
            'SELECT * FROM articles WHERE slug = ? LIMIT 1',
            [$slug]
        );

        return $row ? Article::fromRow($row) : null;
    }

    /**
     * Invalidate the article cache for a given slug.
     */
    public function invalidateCache(string $slug): void
    {
        $cacheKey = sprintf('article:%s', $slug);
        $this->cache->delete($cacheKey);
    }
}`,
      },
      {
        name: "router.php",
        path: "api/router.php",
        language: "php",
        content: `<?php
declare(strict_types=1);

// Minimal front-controller router
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$routes = [
    'GET'  => [
        '/'              => 'HomeController@index',
        '/api/articles'  => 'ArticlesController@index',
        '/api/articles/(?P<slug>[\\w-]+)' => 'ArticlesController@show',
    ],
    'POST' => [
        '/api/articles'  => 'ArticlesController@store',
    ],
];

foreach ($routes[$method] ?? [] as $pattern => $handler) {
    $regex = '#^' . $pattern . '$#';
    if (preg_match($regex, $uri, $matches)) {
        [$class, $action] = explode('@', $handler);
        $controller = new $class($db);
        echo json_encode($controller->$action(...array_filter(
            $matches,
            fn($k) => !is_int($k),
            ARRAY_FILTER_USE_KEY
        )));
        exit;
    }
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);`,
      },
    ],
  },
  {
    name: "scripts",
    path: "scripts",
    children: [
      {
        name: "generate_feed.py",
        path: "scripts/generate_feed.py",
        language: "python",
        content: `"""
RSS feed generator — reads article frontmatter and builds feed.xml.
Run: python scripts/generate_feed.py
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET


CONTENT_DIR = Path("content/articles")
OUTPUT_PATH = Path("public/feed.xml")
SITE_URL    = "https://loicbonin.com"
FEED_TITLE  = "Loïc Bonin — Développeur Fullstack"


@dataclass
class Article:
    slug: str
    title: str
    excerpt: str
    published_at: datetime


def parse_frontmatter(text: str) -> dict[str, str]:
    """Extract YAML-like frontmatter between --- delimiters."""
    match = re.match(r"^---\\n(.+?)\\n---", text, re.DOTALL)
    if not match:
        return {}
    return dict(
        line.split(": ", 1)
        for line in match.group(1).splitlines()
        if ": " in line
    )


def build_feed(articles: list[Article]) -> ET.Element:
    rss = ET.Element("rss", version="2.0")
    channel = ET.SubElement(rss, "channel")
    ET.SubElement(channel, "title").text = FEED_TITLE
    ET.SubElement(channel, "link").text  = SITE_URL

    for article in sorted(articles, key=lambda a: a.published_at, reverse=True):
        item = ET.SubElement(channel, "item")
        ET.SubElement(item, "title").text       = article.title
        ET.SubElement(item, "description").text = article.excerpt
        ET.SubElement(item, "link").text        = f"{SITE_URL}/article/{article.slug}"
        ET.SubElement(item, "pubDate").text     = article.published_at.strftime(
            "%a, %d %b %Y %H:%M:%S +0000"
        )
    return rss


if __name__ == "__main__":
    articles: list[Article] = []

    for path in CONTENT_DIR.glob("*.md"):
        meta = parse_frontmatter(path.read_text())
        if "title" not in meta:
            continue
        articles.append(Article(
            slug        = path.stem,
            title       = meta["title"],
            excerpt     = meta.get("excerpt", ""),
            published_at= datetime.fromisoformat(meta["published_at"]).replace(
                tzinfo=timezone.utc
            ),
        ))

    tree = ET.ElementTree(build_feed(articles))
    ET.indent(tree, space="  ")
    tree.write(OUTPUT_PATH, encoding="unicode", xml_declaration=True)
    print(f"Feed written to {OUTPUT_PATH} ({len(articles)} articles)")`,
      },
    ],
  },
];

const MOCK_PROFILE: Profile = {
  name: "Loïc Bonin",
  bio: `Développeur full-stack basé à Lyon. Depuis 2016, je conçois et développe des applications web responsive. Spécialisé en PHP et TypeScript, j'ai aussi de l'expérience OPS en déploiement et gestion de serveurs dédiées. Appétence pour le mentorat et compétences pédagogiques, je pratique une intégration pragmatique et réfléchie des outils IA pour chaque besoin et contrainte de projet.(SDD/Context Engineering)`,
  skills: [
    {
      term: "Frontend",
      description:
        "Vue.JS, Nuxt.JS, React, Next.js, TypeScript strict, CSS moderne. Sensible à la performance perçue et à l'accessibilité.",
    },
    {
      term: "Backend",
      description:
        "Symfony, Laravel, Sylius, Durpal, Node.js, PayloadCMS, StrapiCMS, Django. Approche architecture sur mesure.",
    },
    {
      term: "Outillage",
      description:
        "Git, GitHub Actions, Docker, IDE, Debian, MacOS, Nginx, Systemd... Approche pragmatique et robuste de l'outillage.",
    },
    {
      term: "Veille",
      description:
        "Suivi régulier des évolutions des outils, normes et Framework via source primaire (documentation). Veille active journalière sur l'évolution et l'utilisation des outils IA.",
    },
  ],
  showTimeline: true,
  timeline: [
    {
      date: "2021 — présent",
      title: "Développeur indépendant et Mentorat",
      description:
        "Accompagnement technique global, choix d'architecture et développement d'applications web sur mesure pour entreprises et indépendants.",
    },
    {
      date: "2025",
      title: "Pixli - Remote - Développeur Fullstack",
      description:
        "Co-développement en équipe d'une plateforme B2B2C avec des pics de fort trafic (gestion et vente de photos scolaires). Création des interfaces frontend avec Nuxt / Vue.js et développement d'endpoints robustes pour l'API backend sous Django (Python).",
    },
    {
      date: "2024",
      title: "Solecooler - Lead Développeur Fullstack",
      description:
        "Conception de A à Z et mise en production de la plateforme e-commerce Solecooler (Stack : Sylius / Symfony / Twig).",
    },
    {
      date: "2021",
      title: "Ynov - Professeur Développement Web ",
      description:
        "Enseignement d'un module d'initiation au développement web: premiers pas, bonnes pratiques, git, création portfolio.",
    },
  ],
  showEducation: true,
  education: [
    {
      date: "2018 — 2019",
      title:
        "Bachelor chef de projet informatique - Systèmes d'information et numérique  | Sciences U Lyon ",
      description: "Spécialisation Gestion de projet Web",
    },
  ],
  cvUrl: "/cv-loic-bonin.pdf",
};

// Helper to perform strict validation at the network boundary
function validateData<T>(
  schema: z.ZodType<T>,
  data: unknown,
  contextName: string,
): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    console.error(
      `[API Network Frontier Validation Error in ${contextName}]:`,
      parsed.error.format(),
    );
    throw new Error(
      `API network boundary validation failed for: ${contextName}`,
    );
  }
  return parsed.data;
}

// ── API functions ──────────────────────────────────────────────────

const BASE_URL =
  (typeof window === 'undefined' ? process.env.API_URL : undefined) ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000/api/v1';

async function fetchFromAPI<T>(path: string, schema: z.ZodType<T>, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: 300 } // Stratégie ISR : 5 min de cache
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const rawData = data.data ?? data;
    return validateData(schema, rawData, path);
  } catch (err) {
    console.warn(`[API Fallback] Fetch failed for ${path}:`, err);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`API fetch failed for ${path}: ${err instanceof Error ? err.message : String(err)}`);
    }
    console.warn(`[API Fallback] Falling back to local mocks for ${path}`);
    return validateData(schema, fallbackData, `${path} (Mock)`);
  }
}

export async function getArticles(params?: {
  category?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedArticles> {
  const { category, tag, page = 1, pageSize = 10 } = params ?? {};
  
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(pageSize),
  });
  if (category && category !== "all") searchParams.append("category", category);
  if (tag) searchParams.append("tag", tag);

  let filtered = [...MOCK_ARTICLES];
  if (category && category !== "all") {
    filtered = filtered.filter((a) => a.category === category);
  }
  if (tag) {
    filtered = filtered.filter((a) => a.tags.includes(tag));
  }
  const start = (page - 1) * pageSize;
  const mockFallback: PaginatedArticles = {
    articles: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  };

  return fetchFromAPI<PaginatedArticles>(
    `/articles?${searchParams.toString()}`,
    PaginatedArticlesSchema,
    mockFallback
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return fetchFromAPI<Article | null>(
    `/articles/${slug}`,
    ArticleSchema.nullable(),
    MOCK_ARTICLES.find((a) => a.slug === slug) ?? null
  );
}

export async function getCategories(): Promise<Category[]> {
  return fetchFromAPI<Category[]>(
    '/categories',
    z.array(CategorySchema),
    MOCK_CATEGORIES
  );
}

export async function getTags(): Promise<Tag[]> {
  return fetchFromAPI<Tag[]>(
    '/tags',
    z.array(z.string()),
    MOCK_TAGS
  );
}

export async function getProjects(): Promise<Project[]> {
  return fetchFromAPI<Project[]>(
    '/projects',
    z.array(ProjectSchema),
    MOCK_PROJECTS
  );
}

export async function getCodeProjects(): Promise<CodeProject[]> {
  return fetchFromAPI<CodeProject[]>(
    '/code/projects',
    z.array(CodeProjectSchema),
    MOCK_CODE_PROJECTS
  );
}

export async function getCodeProjectTree(slug: string): Promise<CodeTree> {
  return fetchFromAPI<CodeTree>(
    `/code/projects/${slug}/tree`,
    CodeTreeSchema,
    MOCK_CODE_TREE
  );
}

export async function getCodeTree(): Promise<CodeTree> {
  await new Promise((r) => setTimeout(r, 100));
  return validateData(CodeTreeSchema, MOCK_CODE_TREE, "getCodeTree");
}

export async function getCodeFile(path: string): Promise<CodeFile | null> {
  const findFileFallback = (): CodeFile | null => {
    const findFile = (tree: CodeTree): CodeFile | null => {
      for (const node of tree) {
        if ("children" in node) {
          const found = findFile(node.children);
          if (found) return found;
        } else if (node.path === path) {
          return node;
        }
      }
      return null;
    };
    return findFile(MOCK_CODE_TREE);
  };

  return fetchFromAPI<CodeFile | null>(
    `/code/files/${path}`,
    CodeFileSchema.nullable(),
    findFileFallback()
  );
}

export async function getProfile(): Promise<Profile> {
  return fetchFromAPI<Profile>(
    '/profile',
    ProfileSchema,
    MOCK_PROFILE
  );
}
