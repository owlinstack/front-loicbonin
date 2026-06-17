'use client'

import { useMemo } from 'react'
import { tokenizeLine, tokenColor } from '@/lib/highlight'

interface HighlightedCodeProps {
  code: string
  language: string
  theme: 'dark' | 'light'
  /** When true, show line numbers */
  lineNumbers?: boolean
  /** Cap the visible lines (for preview cards) */
  maxLines?: number
}

export function HighlightedCode({
  code,
  language,
  theme,
  lineNumbers = false,
  maxLines,
}: HighlightedCodeProps) {
  const lines = useMemo(() => {
    const all = code.split('\n')
    return maxLines ? all.slice(0, maxLines) : all
  }, [code, maxLines])

  const truncated = maxLines !== undefined && code.split('\n').length > maxLines

  return (
    <div style={{ position: 'relative' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          lineHeight: 1.65,
        }}
      >
        <tbody>
          {lines.map((line, idx) => (
            <tr key={idx} style={{ verticalAlign: 'top' }}>
              {lineNumbers && (
                <td
                  aria-hidden="true"
                  style={{
                    width: 40,
                    minWidth: 40,
                    paddingRight: 20,
                    textAlign: 'right',
                    color: theme === 'dark'
                      ? 'rgba(255,255,255,0.12)'
                      : 'rgba(0,0,0,0.18)',
                    userSelect: 'none',
                    fontSize: '0.7rem',
                    paddingTop: 1,
                  }}
                >
                  {idx + 1}
                </td>
              )}
              <td style={{ paddingLeft: lineNumbers ? 0 : undefined, whiteSpace: 'pre' }}>
                {line === '' ? (
                  <span>&nbsp;</span>
                ) : (
                  tokenizeLine(line, language).map((tok, ti) => (
                    <span
                      key={ti}
                      style={{ color: tokenColor(tok.type, theme) }}
                    >
                      {tok.value}
                    </span>
                  ))
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {truncated && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 48,
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, transparent, var(--color-surface))'
              : 'linear-gradient(to bottom, transparent, var(--color-surface))',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
