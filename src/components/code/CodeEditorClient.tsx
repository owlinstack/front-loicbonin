'use client'

import { useEffect, useState } from 'react'
import { FileTree } from '@/components/code/FileTree'
import { CodeViewer } from '@/components/code/CodeViewer'
import { CodeGallery } from '@/components/code/CodeGallery'
import type { CodeFile, CodeTree } from '@/lib/types'

interface CodeEditorClientProps {
  tree: CodeTree
}

function flattenFiles(tree: CodeTree): CodeFile[] {
  const files: CodeFile[] = []
  for (const node of tree) {
    if ('children' in node) files.push(...flattenFiles(node.children))
    else files.push(node)
  }
  return files
}

export function CodeEditorClient({ tree }: CodeEditorClientProps) {
  // Phase A = gallery, Phase B = editor
  const [phase, setPhase]           = useState<'gallery' | 'editor'>('gallery')
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null)
  const [theme, setTheme]           = useState<'dark' | 'light'>('dark')

  // Sync theme with <html data-theme>
  useEffect(() => {
    const read = () => {
      const t = document.documentElement.getAttribute('data-theme')
      setTheme(t === 'light' ? 'light' : 'dark')
    }
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  const handleSelectGallery = (file: CodeFile) => {
    setActiveFile(file)
    setPhase('editor')
  }

  const handleSelectTree = (file: CodeFile) => {
    setActiveFile(file)
  }

  const handleBack = () => {
    setPhase('gallery')
  }

  // In editor phase, auto-resolve file from tree if none selected
  const resolvedFile =
    phase === 'editor'
      ? activeFile ?? (flattenFiles(tree)[0] ?? null)
      : null

  return (
    <>
      {/* ── Phase A: Gallery ── */}
      {phase === 'gallery' && (
        <main
          style={{
            flex: 1,
            padding: '40px 32px 64px',
            maxWidth: 1280,
            width: '100%',
            margin: '0 auto',
          }}
        >
          {/* Page header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 36,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 400,
                  color: 'var(--color-text)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  marginBottom: 6,
                }}
              >
                Extraits de code
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.5,
                }}
              >
                Fragments réutilisables, hooks et utilitaires. Cliquer pour ouvrir l&apos;éditeur.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.06em',
              }}
            >
              {['TS', 'PY', 'PHP', 'CSS', 'HTML'].map((lang) => (
                <span
                  key={lang}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 3,
                    padding: '2px 7px',
                  }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <CodeGallery
            tree={tree}
            theme={theme}
            onSelect={handleSelectGallery}
          />
        </main>
      )}

      {/* ── Phase B: Editor ── */}
      {phase === 'editor' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Editor top bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '8px 16px',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              flexShrink: 0,
            }}
          >
            <button
              onClick={handleBack}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.06em',
                color: 'var(--color-text-muted)',
                transition: 'color 150ms',
                padding: '4px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--color-text)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)')
              }
            >
              ← Galerie
            </button>

            {/* Open-tab style file tabs */}
            <div
              style={{
                display: 'flex',
                overflowX: 'auto',
                gap: 0,
                flex: 1,
                minWidth: 0,
              }}
            >
              {flattenFiles(tree).map((file) => {
                const active = resolvedFile?.path === file.path
                return (
                  <button
                    key={file.path}
                    onClick={() => handleSelectTree(file)}
                    style={{
                      background: active
                        ? 'var(--color-bg)'
                        : 'transparent',
                      border: 'none',
                      borderBottom: active
                        ? '2px solid var(--color-teal)'
                        : '2px solid transparent',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      letterSpacing: '0.03em',
                      color: active
                        ? 'var(--color-text)'
                        : 'var(--color-text-muted)',
                      padding: '6px 16px',
                      whiteSpace: 'nowrap',
                      transition: 'color 150ms, background 150ms',
                      flexShrink: 0,
                    }}
                  >
                    {file.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Editor body */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Sidebar file tree — desktop only */}
            <div className="code-editor-sidebar">
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginBottom: 16,
                  opacity: 0.6,
                }}
              >
                Fichiers
              </p>
              <FileTree
                tree={tree}
                activePath={resolvedFile?.path ?? null}
                onSelect={handleSelectTree}
              />
            </div>

            {/* Code viewer */}
            <CodeViewer file={resolvedFile} theme={theme} />
          </div>
        </div>
      )}

      <style>{`
        .code-editor-sidebar {
          width: 220px;
          flex-shrink: 0;
          border-right: 1px solid var(--color-border);
          overflow-y: auto;
          padding: 20px 16px;
          background: var(--color-surface);
        }
        @media (max-width: 768px) {
          .code-editor-sidebar { display: none; }
        }
      `}</style>
    </>
  )
}
