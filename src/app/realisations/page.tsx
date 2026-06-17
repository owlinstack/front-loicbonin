import { Header } from '@/components/layout/Header'
import { getProjects } from '@/lib/api'
import type { Project } from '@/lib/types'

function TechPill({ label }: { label: string }) {
  return (
    <span className="tag-chip" style={{ cursor: 'default' }}>
      {label}
    </span>
  )
}

function ProjectLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="prose-link"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </a>
  )
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <article
      style={{
        paddingBottom: 56,
        marginBottom: 8,
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          fontWeight: 400,
          color: 'var(--color-text)',
          lineHeight: 1.1,
          marginBottom: 16,
        }}
      >
        {project.title}
      </h2>

      {project.longDescription && (
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.75,
            marginBottom: 24,
          }}
        >
          {project.longDescription}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {project.techStack.map((t) => (
          <TechPill key={t} label={t} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {project.liveUrl && (
          <ProjectLink href={project.liveUrl}>Voir le projet ↗</ProjectLink>
        )}
        {project.repoUrl && (
          <ProjectLink href={project.repoUrl}>Code source ↗</ProjectLink>
        )}
      </div>
    </article>
  )
}

function SmallProject({ project }: { project: Project }) {
  return (
    <article className="small-project-card">
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-lg)',
          fontWeight: 400,
          color: 'var(--color-text)',
          lineHeight: 1.15,
          marginBottom: 10,
        }}
      >
        {project.title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          lineHeight: 1.7,
          marginBottom: 16,
        }}
      >
        {project.description}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {project.techStack.map((t) => (
          <TechPill key={t} label={t} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        {project.liveUrl && (
          <ProjectLink href={project.liveUrl}>Voir ↗</ProjectLink>
        )}
        {project.repoUrl && (
          <ProjectLink href={project.repoUrl}>Code ↗</ProjectLink>
        )}
      </div>
    </article>
  )
}

export default async function RealisationsPage() {
  const projects = await getProjects()

  const featuredProject = projects.find((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <Header />

      <main
        style={{
          maxWidth: 680,
          margin: '0 auto',
          padding: '56px 24px 96px',
        }}
      >
        {/* Page header */}
        <header style={{ marginBottom: 56 }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: 12,
            }}
          >
            Portfolio
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xl)',
              fontWeight: 400,
              color: 'var(--color-text)',
              lineHeight: 1.05,
            }}
          >
            Réalisations
          </h1>
        </header>

        {featuredProject && (
          <>
            <FeaturedProject project={featuredProject} />
            <hr
              style={{
                border: 'none',
                borderTop: '1px solid var(--color-border)',
                marginBottom: 48,
              }}
            />
          </>
        )}

        {/* 2-column grid for smaller projects */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 48,
          }}
        >
          {otherProjects.map((project) => (
            <SmallProject key={project.id} project={project} />
          ))}
        </div>
      </main>

      <style>{`
        .small-project-card {
          background-color: transparent;
          transition: background-color 150ms;
          padding: 16px;
          margin: -16px;
          border-radius: 2px;
        }
        .small-project-card:hover {
          background-color: var(--color-surface);
        }
      `}</style>
    </div>
  )
}
