'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HighlightedCode } from './HighlightedCode'
import type { CodeFile } from '@/lib/types'

interface CodeViewerProps {
  file: CodeFile | null
  theme: 'dark' | 'light'
}

export function CodeViewer({ file, theme }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!file) return
    try {
      await navigator.clipboard.writeText(file.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {}
  }

  if (!file) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Sélectionner un fichier
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-surface)',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 16px',
          borderBottom: '1px solid var(--color-border)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.06em',
          color: 'var(--color-text-muted)',
          flexShrink: 0,
          gap: 12,
        }}
      >
        {/* Path breadcrumb */}
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            opacity: 0.55,
            minWidth: 0,
          }}
        >
          {file.path}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
          {/* Linked article */}
          {file.linkedArticleSlug && file.linkedArticleTitle && (
            <Link
              href={`/article/${file.linkedArticleSlug}`}
              style={{
                color: 'var(--color-teal)',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                transition: 'opacity 150ms',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              {'↗ '}{file.linkedArticleTitle}
            </Link>
          )}

          {/* Language badge */}
          <span
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.45,
            }}
          >
            {file.language}
          </span>

          {/* Copy */}
          <button
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: copied ? 'var(--color-teal)' : 'var(--color-text-muted)',
              transition: 'color 150ms',
              padding: 0,
            }}
          >
            {copied ? 'Copié ✓' : 'Copier'}
          </button>
        </div>
      </div>

      {/* Highlighted code */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '20px 24px 32px',
        }}
      >
        <HighlightedCode
          code={file.content}
          language={file.language}
          theme={theme}
          lineNumbers
        />
      </div>
    </div>
  )
}
