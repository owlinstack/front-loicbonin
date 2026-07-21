'use client'

import type { GithubProject } from '@/lib/types'

interface GithubProjectGridProps {
  projects: GithubProject[]
}

function GithubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ color: 'var(--color-text)', opacity: 0.9 }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export function GithubProjectGrid({ projects }: GithubProjectGridProps) {
  if (!projects || projects.length === 0) {
    return null
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
        gap: 24,
      }}
    >
      {projects.map((project) => (
        <a
          key={project.id}
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Voir le projet ${project.name} sur GitHub (ouvre dans un nouvel onglet)`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            textAlign: 'left',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            cursor: 'pointer',
            overflow: 'hidden',
            transition: 'border-color 200ms, box-shadow 200ms, transform 200ms',
            textDecoration: 'none',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'rgba(255, 255, 255, 0.16)'
            el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--color-border)'
            el.style.boxShadow = 'none'
            el.style.transform = 'none'
          }}
        >
          {/* Top header with GitHub logo & badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid var(--color-border)',
              background: 'rgba(255, 255, 255, 0.02)',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <GithubIcon />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--color-text)',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                }}
              >
                GITHUB REPO
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Project Details */}
          <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 500,
                color: 'var(--color-text)',
                marginBottom: 10,
                letterSpacing: '-0.01em',
              }}
            >
              {project.name}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                lineHeight: 1.5,
                flex: 1,
              }}
            >
              {project.description || 'Aucune description fournie pour ce dépôt.'}
            </p>

            {/* Action link */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 20,
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-teal)',
                letterSpacing: '0.04em',
              }}
            >
              <span>voir sur github</span>
              <span style={{ transition: 'transform 200ms' }}>→</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
