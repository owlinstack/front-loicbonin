'use client'

import { useMemo } from 'react'
import { tokenizeCode, tokenColor } from '@/lib/highlight'

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
  const tokenizedLines = useMemo(() => {
    const allLines = tokenizeCode(code, language)
    return maxLines ? allLines.slice(0, maxLines) : allLines
  }, [code, language, maxLines])

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
          {tokenizedLines.map((lineTokens, idx) => (
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
              <td
                className="code-cell"
                style={{ paddingLeft: lineNumbers ? 0 : undefined }}
              >
                {lineTokens.length === 0 ? (
                   <span>&nbsp;</span>
                 ) : (
                   lineTokens.map((tok, ti) => (
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

      <style>{`
        .code-cell {
          white-space: pre;
          word-break: normal;
          overflow-wrap: normal;
        }
        @media (max-width: 640px) {
          .code-cell {
            white-space: pre-wrap !important;
            word-break: break-all !important;
            overflow-wrap: break-word !important;
          }
        }
      `}</style>

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
