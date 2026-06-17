"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HighlightedCode } from "@/components/code/HighlightedCode";
import type { Article, CodeFile } from "@/lib/types";

interface AssociatedCodeSectionProps {
  article: Article;
}

function findFirstFile(node: any): CodeFile | null {
  if (!node) return null;
  if (typeof node === "object" && "content" in node && typeof node.content === "string") {
    return node as CodeFile;
  }
  if (typeof node === "object" && "children" in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findFirstFile(child);
      if (found) return found;
    }
  }
  if (typeof node === "object" && "tree" in node && Array.isArray(node.tree)) {
    for (const child of node.tree) {
      const found = findFirstFile(child);
      if (found) return found;
    }
  }
  return null;
}

export function AssociatedCodeSection({ article }: AssociatedCodeSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const { codeFile, codeFolder, codeProject } = article;

  if (!codeFile && !codeFolder && !codeProject) {
    return null;
  }

  // Resolve project name and slug
  let displayName = "";
  let projectSlug = "";
  let targetFile: CodeFile | null = null;

  if (codeFile) {
    displayName = `Fichier : ${codeFile.name}`;
    projectSlug = codeFile.projectSlug || "";
    targetFile = codeFile;
  } else if (codeFolder) {
    displayName = `Dossier : ${codeFolder.name}`;
    projectSlug = codeFolder.projectSlug || "";
    targetFile = findFirstFile(codeFolder);
  } else if (codeProject) {
    displayName = `Projet : ${codeProject.name}`;
    projectSlug = codeProject.slug || "";
    targetFile = findFirstFile(codeProject);
  }

  // If no projectSlug can be resolved, fallback to the codeProject's slug
  if (!projectSlug && codeProject) {
    projectSlug = codeProject.slug;
  }

  const explorerUrl = targetFile
    ? `/code?project=${projectSlug}&file=${encodeURIComponent(targetFile.path)}`
    : `/code?project=${projectSlug}`;

  return (
    <div
      style={{
        marginTop: 48,
        border: "1px solid var(--color-border)",
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "var(--color-surface)",
      }}
    >
      {/* Header / Toggle Button */}
      <button
        id="associated-code-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: "var(--color-text)",
          textAlign: "left",
          transition: "background-color 150ms",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255, 255, 255, 0.02)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CodeIcon />
          <span>Code source associé ({displayName})</span>
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          {/* Top Panel Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 20px",
              backgroundColor: "var(--color-surface)",
              borderBottom: "1px solid var(--color-border)",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
              }}
            >
              {targetFile ? `Aperçu de ${targetFile.path}` : "Aucun fichier à prévisualiser"}
            </span>
            <Link
              id="associated-code-explorer-link"
              href={explorerUrl}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-text)",
                textDecoration: "none",
                letterSpacing: "0.04em",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderBottom: "1px solid transparent",
                transition: "border-color 150ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderBottom = "1px solid var(--color-text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderBottom = "1px solid transparent";
              }}
            >
              Ouvrir dans l&apos;explorateur de code ↗
            </Link>
          </div>

          {/* Code View */}
          {targetFile ? (
            <div
              style={{
                padding: "20px",
                overflowX: "auto",
                maxHeight: "400px",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <HighlightedCode
                code={targetFile.content}
                language={targetFile.language}
                theme={theme}
                lineNumbers={true}
              />
            </div>
          ) : (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
              Ce dossier ou projet ne contient aucun fichier de code directement affichable.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CodeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 200ms ease",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
