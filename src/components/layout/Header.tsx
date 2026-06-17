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
          style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          <LBMonogram />
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
            onClick={() => setDrawerOpen(true)}
            aria-label="Ouvrir le menu"
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
            zIndex: 199,
          }}
        />
      )}

      {/* Mobile drawer */}
      <nav
        aria-label="Menu mobile"
        style={{
          position: 'fixed',
          inset: '0 auto 0 0',
          width: 280,
          backgroundColor: 'var(--color-bg)',
          borderRight: '1px solid var(--color-border)',
          zIndex: 200,
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease',
          padding: '24px 20px',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <LBMonogram />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Fermer le menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              fontSize: 24,
              lineHeight: 1,
              padding: 4,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
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
        </div>
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

function LBMonogram() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: 'var(--color-text)' }}
    >
      <polyline points="4,4 4,20 11,20" />
      <path d="M13,4 L13,20 M13,4 L18,4 Q21,4 21,7.5 Q21,11 13,11 M13,11 L18,11 Q21,11 21,15.5 Q21,20 13,20" />
    </svg>
  )
}
