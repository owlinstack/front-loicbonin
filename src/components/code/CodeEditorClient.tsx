'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FileTree } from '@/components/code/FileTree'
import { CodeViewer } from '@/components/code/CodeViewer'
import { ProjectGrid } from '@/components/code/ProjectGrid'
import { GithubProjectGrid } from '@/components/code/GithubProjectGrid'
import { getCodeProjectTree } from '@/lib/api'
import type { CodeFile, CodeTree, CodeProject, GithubProject } from '@/lib/types'

interface CodeEditorClientProps {
  projects: CodeProject[]
  githubProjects?: GithubProject[]
}

function flattenFiles(tree: CodeTree): CodeFile[] {
  const files: CodeFile[] = []
  for (const node of tree) {
    if ('children' in node) files.push(...flattenFiles(node.children))
    else files.push(node)
  }
  return files
}

export function CodeEditorClient({ projects, githubProjects = [] }: CodeEditorClientProps) {
  const [phase, setPhase]           = useState<'projects' | 'editor'>('projects')
  const [activeProject, setActiveProject] = useState<CodeProject | null>(null)
  const [activeTree, setActiveTree] = useState<CodeTree>([])
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null)
  const [isLoading, setIsLoading]   = useState(false)
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

  const searchParams = useSearchParams()
  const projectSlug = searchParams.get('project')
  const fileParam = searchParams.get('file')

  const handleSelectProject = async (project: CodeProject, fileToSelect?: string | null) => {
    setIsLoading(true)
    setActiveProject(project)
    try {
      const tree = await getCodeProjectTree(project.slug)
      setActiveTree(tree)
      const files = flattenFiles(tree)
      if (files.length > 0) {
        const matchingFile = fileToSelect
          ? files.find((f) => f.path === fileToSelect)
          : null
        setActiveFile(matchingFile || files[0])
      } else {
        setActiveFile(null)
      }
      setPhase('editor')
    } catch (err) {
      console.error('Failed to load project code tree:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Load project from query parameters on load
  useEffect(() => {
    if (projectSlug && projects.length > 0) {
      const found = projects.find((p) => p.slug === projectSlug)
      if (found) {
        const timer = setTimeout(() => {
          handleSelectProject(found, fileParam)
        }, 0)
        return () => clearTimeout(timer)
      }
    }
  }, [projectSlug, fileParam, projects])

  const handleSelectTree = (file: CodeFile) => {
    setActiveFile(file)
  }

  const handleBack = () => {
    setPhase('projects')
    setActiveProject(null)
    setActiveTree([])
    setActiveFile(null)
  }

  const filesList = flattenFiles(activeTree)

  return (
    <>
      {/* ── Phase A: Grille des Projets ── */}
      {phase === 'projects' && (
        <main className="code-explorer-main">
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
                Explorateur de Code
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.5,
                }}
              >
                Parcourez les sources réelles de mes différents projets et réalisations.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 0',
                gap: 12,
              }}
            >
              <div className="spinner" />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Chargement de l&apos;arborescence du projet...
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              {/* Section 1: Projets de Code Interactifs */}
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    marginBottom: 16,
                    opacity: 0.8,
                  }}
                >
                  Projets avec Explorateur
                </h2>
                <ProjectGrid projects={projects} onSelect={handleSelectProject} />
              </div>

              {/* Section 2: Projets GitHub */}
              {githubProjects.length > 0 && (
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-muted)',
                      marginBottom: 16,
                      opacity: 0.8,
                    }}
                  >
                    Dépôts GitHub
                  </h2>
                  <GithubProjectGrid projects={githubProjects} />
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* ── Phase B: Éditeur de Code ── */}
      {phase === 'editor' && !isLoading && (
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
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--color-text)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)')
              }
            >
              ← Projets
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
              {filesList.map((file) => {
                const active = activeFile?.path === file.path
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
                tree={activeTree}
                activePath={activeFile?.path ?? null}
                onSelect={handleSelectTree}
              />
            </div>

            {/* Code viewer */}
            <CodeViewer file={activeFile} theme={theme} />
          </div>
        </div>
      )}

      <style>{`
        .code-explorer-main {
          flex: 1;
          padding: 40px 32px 64px;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
        }
        .code-editor-sidebar {
          width: 220px;
          flex-shrink: 0;
          border-right: 1px solid var(--color-border);
          overflow-y: auto;
          padding: 20px 16px;
          background: var(--color-surface);
        }
        .spinner {
          width: 28px;
          height: 28px;
          border: 2px solid var(--color-border);
          border-top-color: var(--color-teal);
          border-radius: 50%;
          animation: spin 800ms linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .code-editor-sidebar { display: none; }
        }
        @media (max-width: 640px) {
          .code-explorer-main {
            padding: 24px 16px 48px;
          }
        }
      `}</style>
    </>
  )
}
