'use client'

import type { CodeProject } from '@/lib/types'

interface ProjectGridProps {
  projects: CodeProject[]
  onSelect: (project: CodeProject) => void
}

export function ProjectGrid({ projects, onSelect }: ProjectGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
        gap: 24,
      }}
    >
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onSelect(project)}
          aria-label={`Ouvrir le projet ${project.name}`}
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
          {/* Top project header with window buttons */}
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
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57','#febc2e','#28c840'].map((c) => (
                <div key={c} style={{
                  width: 9, height: 9, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                }} />
              ))}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              PROJET
            </span>
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
              {project.description || "Aucune description fournie pour ce projet."}
            </p>

            {/* Action button simulator */}
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
              <span>Explorer le code</span>
              <span style={{ transition: 'transform 200ms' }}>→</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
