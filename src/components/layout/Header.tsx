'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const NAV_LINKS = [
  { href: '/', label: 'Veille' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/code', label: 'Code' },
  { href: '/profil', label: 'Profil' },
]

export function Header() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 56,
          backgroundColor: 'var(--color-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Loïc Bonin — accueil"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            textDecoration: 'none',
            color: 'var(--color-text)',
          }}
        >
          Loïc Bonin
        </Link>

        {/* Desktop nav — centered absolutely so logo/actions don't fight */}
        <nav
          aria-label="Navigation principale"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 32,
          }}
          className="header-nav"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${isActive(href) ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label={drawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={drawerOpen}
            className="hamburger-btn"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              flexDirection: 'column',
              gap: 5,
              padding: 8,
              color: 'var(--color-text)',
            }}
          >
            <span style={{ display: 'block', width: 20, height: 2, background: 'currentColor', borderRadius: 1 }} />
            <span style={{ display: 'block', width: 20, height: 2, background: 'currentColor', borderRadius: 1 }} />
            <span style={{ display: 'block', width: 20, height: 2, background: 'currentColor', borderRadius: 1 }} />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 98,
          }}
        />
      )}

      {/* Mobile menu */}
      <nav
        aria-label="Menu mobile"
        style={{
          position: 'fixed',
          top: 56,
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          zIndex: 99,
          transform: drawerOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '24px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setDrawerOpen(false)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-lg)',
              color: isActive(href) ? 'var(--color-text)' : 'var(--color-text-muted)',
              transition: 'color 150ms',
              textDecoration: 'none',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      <style>{`
        .header-nav    { display: flex; }
        .hamburger-btn { display: none !important; }
        @media (max-width: 768px) {
          .header-nav    { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
