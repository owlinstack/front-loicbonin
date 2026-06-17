"use client";

import type { CodeFile, CodeFolder, CodeTree } from "@/lib/types";

interface FileTreeProps {
  tree: CodeTree;
  activePath: string | null;
  onSelect: (file: CodeFile) => void;
  level?: number;
}

function isFolder(node: CodeFile | CodeFolder): node is CodeFolder {
  return "children" in node;
}

export function FileTree({
  tree,
  activePath,
  onSelect,
  level = 0,
}: FileTreeProps) {
  return (
    <ul style={{ listStyle: "none" }} role="tree">
      {tree.map((node) => {
        if (isFolder(node)) {
          return (
            <li
              key={node.path}
              role="treeitem"
              aria-expanded="true"
              aria-selected={false}
            >
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  lineHeight: 2,
                  color: "var(--color-text)",
                  fontWeight: 500,
                  paddingLeft: level * 16,
                  letterSpacing: "0.04em",
                  userSelect: "none",
                }}
              >
                {node.name}
              </span>
              <FileTree
                tree={node.children}
                activePath={activePath}
                onSelect={onSelect}
                level={level + 1}
              />
            </li>
          );
        }

        const active = activePath === node.path;
        return (
          <li key={node.path} role="treeitem" aria-selected={active}>
            <button
              onClick={() => onSelect(node)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                lineHeight: 2,
                paddingLeft: level * 16,
                letterSpacing: "0.04em",
                color: active ? "var(--color-text)" : "var(--color-text-muted)",
                transition: "color 150ms",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--color-text)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--color-text-muted)";
                }
              }}
            >
              {active ? "→ " : ""}
              {node.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
