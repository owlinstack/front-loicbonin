"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface TagPanelProps {
  tags: string[];
  activeCategory?: string;
  activeTag?: string;
}

export function TagPanel({ tags, activeCategory = "all", activeTag }: TagPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div style={{ marginTop: 40 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Afficher les tags"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.08em",
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          padding: 0,
          display: "inline-block",
          transition: "color 150ms",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color =
            "var(--color-text)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color =
            "var(--color-text-muted)";
        }}
      >
        tags {open ? "↑" : "→"}
      </button>

      <div
        ref={panelRef}
        style={{
          maxHeight: open ? 400 : 0,
          overflow: "hidden",
          transition: "max-height 300ms ease-out",
        }}
      >
        <div
          style={{
            paddingTop: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {tags.map((tag) => {
            const isActive = activeTag === tag;
            const targetHref = isActive
              ? (activeCategory === "all" ? "/" : `/?category=${activeCategory}`)
              : `/?category=${activeCategory}&tag=${tag}`;

            return (
              <Link
                key={tag}
                href={targetHref}
                className={`tag-chip${isActive ? " active" : ""}`}
              >
                {tag}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
