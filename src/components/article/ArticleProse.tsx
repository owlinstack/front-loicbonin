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
  | { type: "code"; key: string; lang: string; code: string };

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
  return escaped
    .replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
      const resolvedUrl = resolveImageUrl(url);
      return `<img src="${resolvedUrl}" alt="${alt}" class="article-image" />`;
    })
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
          default:
            return null;
        }
      })}
    </div>
  );
}
