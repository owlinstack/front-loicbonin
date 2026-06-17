'use client'

import { HighlightedCode } from './HighlightedCode'
import type { CodeFile, CodeTree } from '@/lib/types'

interface CodeGalleryProps {
  tree: CodeTree
  theme: 'dark' | 'light'
  onSelect: (file: CodeFile) => void
}

function flattenFiles(tree: CodeTree): CodeFile[] {
  const files: CodeFile[] = []
  for (const node of tree) {
    if ('children' in node) {
      files.push(...flattenFiles(node.children))
    } else {
      files.push(node)
    }
  }
  return files
}

// Lang label displayed in the badge
const LANG_LABELS: Record<string, string> = {
  typescript: 'TS',
  javascript: 'JS',
  css:        'CSS',
  html:       'HTML',
  php:        'PHP',
  python:     'PY',
}

// Subtle accent color per language for the badge
const LANG_ACCENTS_DARK: Record<string, string> = {
  typescript: 'rgba(126,184,196,0.15)',
  javascript: 'rgba(196,154,108,0.15)',
  css:        'rgba(163,184,153,0.15)',
  html:       'rgba(196,138,122,0.15)',
  php:        'rgba(180,160,196,0.15)',
  python:     'rgba(196,180,122,0.15)',
}
const LANG_ACCENTS_LIGHT: Record<string, string> = {
  typescript: 'rgba(61,122,138,0.09)',
  javascript: 'rgba(138,96,48,0.09)',
  css:        'rgba(85,122,90,0.09)',
  html:       'rgba(138,74,58,0.09)',
  php:        'rgba(106,80,128,0.09)',
  python:     'rgba(122,104,48,0.09)',
}

const LANG_TEXT_DARK: Record<string, string> = {
  typescript: '#7eb8c4',
  javascript: '#c49a6c',
  css:        '#a3b899',
  html:       '#c48a7a',
  php:        '#b4a0c4',
  python:     '#c4b47a',
}
const LANG_TEXT_LIGHT: Record<string, string> = {
  typescript: '#3d7a8a',
  javascript: '#8a6030',
  css:        '#557a5a',
  html:       '#8a4a3a',
  php:        '#6a5080',
  python:     '#7a6830',
}

export function CodeGallery({ tree, theme, onSelect }: CodeGalleryProps) {
  const files = flattenFiles(tree)
  const isDark = theme === 'dark'

  return (
    <div>
      {/* Grid of cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 20,
        }}
      >
        {files.map((file) => {
          const lang    = file.language.toLowerCase()
          const label   = LANG_LABELS[lang] ?? lang.toUpperCase()
          const bgAccent = isDark
            ? LANG_ACCENTS_DARK[lang]  ?? 'rgba(255,255,255,0.04)'
            : LANG_ACCENTS_LIGHT[lang] ?? 'rgba(0,0,0,0.04)'
          const textAccent = isDark
            ? LANG_TEXT_DARK[lang]  ?? 'var(--color-text-muted)'
            : LANG_TEXT_LIGHT[lang] ?? 'var(--color-text-muted)'

          return (
            <button
              key={file.path}
              onClick={() => onSelect(file)}
              aria-label={`Ouvrir ${file.name}`}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'border-color 200ms, box-shadow 200ms',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = isDark
                  ? 'rgba(255,255,255,0.16)'
                  : 'rgba(0,0,0,0.22)'
                el.style.boxShadow = isDark
                  ? '0 4px 20px rgba(0,0,0,0.4)'
                  : '0 4px 20px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'var(--color-border)'
                el.style.boxShadow = 'none'
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--color-border)',
                  background: bgAccent,
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  {/* Window dots */}
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    {['#ff5f57','#febc2e','#28c840'].map((c) => (
                      <div key={c} style={{
                        width: 9, height: 9, borderRadius: '50%',
                        background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                      }} />
                    ))}
                  </div>

                  {/* Filename */}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text)',
                      letterSpacing: '0.04em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {file.path}
                  </span>
                </div>

                {/* Language badge */}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: textAccent,
                    background: bgAccent,
                    border: `1px solid ${textAccent}33`,
                    borderRadius: 3,
                    padding: '2px 7px',
                    flexShrink: 0,
                  }}
                >
                  {label}
                </span>
              </div>

              {/* Code preview */}
              <div
                style={{
                  padding: '14px 16px 18px',
                  overflow: 'hidden',
                  maxHeight: 186,
                  position: 'relative',
                }}
              >
                <HighlightedCode
                  code={file.content}
                  language={file.language}
                  theme={theme}
                  maxLines={11}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
