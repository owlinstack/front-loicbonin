"use client";

import { useEffect, useState, useMemo } from "react";
import { HighlightedCode } from "@/components/code/HighlightedCode";

interface ArticleProseProps {
  content: string;
}

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Block =
  | { type: "p"; key: string; text: string }
  | { type: HeadingLevel; key: string; text: string }
  | { type: "blockquote"; key: string; text: string }
  | { type: "code"; key: string; lang: string; code: string }
  | { type: "ul" | "ol"; key: string; items: string[] };

function parseMarkdownToBlocks(raw: string): Block[] {
  const lines = raw.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  let currentParagraphLines: string[] = [];
  let inCodeBlock = false;
  let codeLang = "";
  let codeLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      blocks.push({
        type: "p",
        key: `p-${blocks.length}-${i}`,
        text: currentParagraphLines.join("\n"),
      });
      currentParagraphLines = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Code block start
    if (!inCodeBlock && line.match(/^```(\w*)/)) {
      flushParagraph();
      codeLang = line.match(/^```(\w*)/)?.[1] || "code";
      codeLines = [];
      inCodeBlock = true;
      i++;
      continue;
    }

    // Code block end
    if (inCodeBlock && line.trim() === "```") {
      blocks.push({
        type: "code",
        key: `code-${blocks.length}-${i}`,
        lang: codeLang,
        code: codeLines.join("\n"),
      });
      inCodeBlock = false;
      codeLines = [];
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      i++;
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      flushParagraph();
      i++;
      continue;
    }

    // Headings h1 to h6
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      const level = `h${headingMatch[1].length}` as HeadingLevel;
      const text = headingMatch[2].replace(/\s+#+$/, "").trim();
      blocks.push({
        type: level,
        key: `${level}-${blocks.length}-${i}`,
        text: text,
      });
      i++;
      continue;
    }

    // blockquote
    if (line.startsWith("> ")) {
      flushParagraph();
      const bqLines = [line.slice(2)];
      let nextIdx = i + 1;
      while (nextIdx < lines.length && lines[nextIdx].startsWith("> ")) {
        bqLines.push(lines[nextIdx].slice(2));
        nextIdx++;
      }
      blocks.push({
        type: "blockquote",
        key: `bq-${blocks.length}-${i}`,
        text: bqLines.join("\n"),
      });
      i = nextIdx;
      continue;
    }

    // Unordered list item
    const ulMatch = line.match(/^\s*[-*+]\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      const items = [ulMatch[1]];
      let nextIdx = i + 1;
      while (nextIdx < lines.length) {
        const nextLine = lines[nextIdx];
        const nextUlMatch = nextLine.match(/^\s*[-*+]\s+(.+)$/);
        if (nextUlMatch) {
          items.push(nextUlMatch[1]);
          nextIdx++;
        } else {
          break;
        }
      }
      blocks.push({
        type: "ul",
        key: `ul-${blocks.length}-${i}`,
        items: items,
      });
      i = nextIdx;
      continue;
    }

    // Ordered list item
    const olMatch = line.match(/^\s*(\d+)\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      const items = [olMatch[2]];
      let nextIdx = i + 1;
      while (nextIdx < lines.length) {
        const nextLine = lines[nextIdx];
        const nextOlMatch = nextLine.match(/^\s*(\d+)\.\s+(.+)$/);
        if (nextOlMatch) {
          items.push(nextOlMatch[2]);
          nextIdx++;
        } else {
          break;
        }
      }
      blocks.push({
        type: "ol",
        key: `ol-${blocks.length}-${i}`,
        items: items,
      });
      i = nextIdx;
      continue;
    }

    // Regular text line
    currentParagraphLines.push(line);
    i++;
  }

  flushParagraph();
  return blocks;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function resolveImageUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  try {
    const origin = new URL(apiUrl).origin;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${origin}${cleanUrl}`;
  } catch (e) {
    return url;
  }
}

function processInline(text: string): string {
  const escaped = escapeHtml(text);
  
  // 1. Image parsing
  const withImages = escaped.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
    const resolvedUrl = resolveImageUrl(url);
    return `<img src="${resolvedUrl}" alt="${alt}" class="article-image" />`;
  });
  
  // 2. Link parsing (with custom GitHub Repository Card integration)
  const withLinks = withImages.replace(/\[(.*?)\]\((.*?)\)/g, (match, label, url) => {
    const decodedUrl = url.replace(/&amp;/g, "&");
    const githubMatch = decodedUrl.match(/^https?:\/\/(www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/);
    
    if (githubMatch) {
      const owner = githubMatch[2];
      const repo = githubMatch[3];
      return `<a href="${decodedUrl}" target="_blank" rel="noopener noreferrer" class="github-repo-card" title="Voir le dépôt GitHub ${owner}/${repo}">` +
        `<svg class="github-icon" viewBox="0 0 16 16" version="1.1" aria-hidden="true" width="16" height="16" fill="currentColor">` +
        `<path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.35 3.12.88.01.47.01.84.01.93 0 .22-.16.47-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>` +
        `</svg>` +
        `<span class="github-repo-name">${owner}/${repo}</span>` +
        `</a>`;
    }
    
    return `<a href="${decodedUrl}" target="_blank" rel="noopener noreferrer" class="prose-link">${label}</a>`;
  });
  
  // 3. Other inline parsing
  return withLinks
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

export function ArticleProse({ content }: ArticleProseProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const read = () => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "light" ? "light" : "dark");
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const fetchStars = async () => {
      const cards = document.querySelectorAll(".github-repo-card");
      for (const card of Array.from(cards)) {
        const href = card.getAttribute("href");
        if (!href || card.querySelector(".github-stars")) continue;

        const match = href.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) continue;

        const owner = match[1];
        const repo = match[2];
        const cacheKey = `gh-stars-${owner}-${repo}`;

        const renderStars = (starsStr: string) => {
          if (card.querySelector(".github-stars")) return;
          const starsEl = document.createElement("span");
          starsEl.className = "github-stars";
          starsEl.innerHTML = `<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="display:inline-block;vertical-align:-1px;margin-right:4px;"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97 1.019 4.154a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l1.02-4.155L1.12 7.373a.75.75 0 0 1 .416-1.28l4.21-.611L7.627.668A.75.75 0 0 1 8 .25Z"></path></svg>${starsStr}`;
          card.appendChild(starsEl);
        };

        if (typeof window !== "undefined") {
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            renderStars(cached);
            continue;
          }
        }

        try {
          const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
          if (res.ok) {
            const data = await res.json();
            const stars = data.stargazers_count;
            const formatted = stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : String(stars);
            if (typeof window !== "undefined") {
              sessionStorage.setItem(cacheKey, formatted);
            }
            renderStars(formatted);
          }
        } catch (e) {
          // Ignore API/network errors
        }
      }
    };

    const timer = setTimeout(fetchStars, 100);
    return () => clearTimeout(timer);
  }, [content, theme]);

  const blocks = useMemo(() => parseMarkdownToBlocks(content), [content]);

  return (
    <div className="article-prose">
      {blocks.map((block) => {
        switch (block.type) {
          case "p":
            return (
              <p
                key={block.key}
                dangerouslySetInnerHTML={{ __html: processInline(block.text) }}
              />
            );
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6": {
            const Tag = block.type;
            return (
              <Tag
                key={block.key}
                dangerouslySetInnerHTML={{ __html: processInline(block.text) }}
              />
            );
          }
          case "blockquote":
            return (
              <blockquote
                key={block.key}
                dangerouslySetInnerHTML={{ __html: processInline(block.text) }}
              />
            );
          case "code":
            return (
              <div
                key={block.key}
                style={{
                  margin: "2.5em 0",
                  borderRadius: 4,
                  border: "1px solid var(--color-border)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 16px",
                    backgroundColor: "var(--color-surface)",
                    borderBottom: "1px solid var(--color-border)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <span>{block.lang}</span>
                </div>
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    backgroundColor: "var(--color-surface)",
                    overflowX: "auto",
                  }}
                >
                  <HighlightedCode
                    code={block.code}
                    language={block.lang}
                    theme={theme}
                    lineNumbers={true}
                  />
                </div>
              </div>
            );
          case "ul":
          case "ol": {
            const Tag = block.type;
            return (
              <Tag key={block.key}>
                {block.items.map((item, idx) => (
                  <li
                    key={`${block.key}-li-${idx}`}
                    dangerouslySetInnerHTML={{ __html: processInline(item) }}
                  />
                ))}
              </Tag>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
