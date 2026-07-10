'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Lock, Unlock, Newspaper, Briefcase, Code2, User } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Veille', icon: Newspaper },
  { href: '/realisations', label: 'Réalisations', icon: Briefcase },
  { href: '/code', label: 'Code', icon: Code2 },
  { href: '/profil', label: 'Profil', icon: User },
]

export function Header() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMinified, setIsMinified] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      const stored = localStorage.getItem('nav_minified')
      if (stored === 'true') {
        setIsMinified(true)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const toggleMinified = () => {
    const nextVal = !isMinified
    setIsMinified(nextVal)
    localStorage.setItem('nav_minified', String(nextVal))
    setDrawerOpen(false)
  }

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
          className={`header-logo ${mounted && isMinified ? 'hide-on-mobile' : ''}`}
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

        {/* Minified Mobile Nav Row */}
        {mounted && isMinified && (
          <nav
            className="minified-mobile-nav"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <button
              onClick={toggleMinified}
              aria-label="Déverrouiller le menu"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-teal)',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Lock size={18} />
            </button>

            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                style={{
                  color: isActive(href) ? 'var(--color-text)' : 'var(--color-text-muted)',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 150ms',
                }}
              >
                <Icon size={18} />
              </Link>
            ))}
          </nav>
        )}

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label={drawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={drawerOpen}
            className={`hamburger-btn ${drawerOpen ? 'open' : ''} ${mounted && isMinified ? 'hide-on-mobile' : ''}`}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text)',
            }}
          >
            <span />
            <span />
            <span />
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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

        <button
          onClick={toggleMinified}
          aria-label="Minifier le menu"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '16px 0 0',
            borderTop: '1px solid var(--color-border)',
            width: '100%',
          }}
        >
          <Unlock size={16} />
          <span>Minifier le menu</span>
        </button>
      </nav>

      <style>{`
        .header-nav    { display: flex; }
        .hamburger-btn {
          display: none !important;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
        }
        .hamburger-btn span {
          display: block;
          width: 20px;
          height: 2px;
          background-color: currentColor;
          border-radius: 1px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .hamburger-btn.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .hamburger-btn.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger-btn.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        @media (max-width: 768px) {
          .header-nav    { display: none !important; }
          .hamburger-btn { display: flex !important; }
          
          .minified-mobile-nav {
            display: flex !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
