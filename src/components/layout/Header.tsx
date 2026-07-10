'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
  const [isMinified, setIsMinified] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('nav_minified') === 'true'
  })

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
        className={isMinified ? 'header-minified' : ''}
        suppressHydrationWarning
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
          <span className="logo-full">Loïc Bonin</span>
          <span className="logo-short">LB</span>
        </Link>

        {/* Minified Mobile Nav Row */}
        <nav
          className="minified-mobile-nav"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              style={{
                color: isActive(href) ? 'var(--color-text)' : 'var(--color-text-muted)',
                padding: '6px 4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 150ms',
              }}
            >
              <Icon size={18} />
            </Link>
          ))}
        </nav>

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

          {/* Minify Unlock Toggle Button - replaces Hamburger on mobile when minified */}
          <button
            onClick={toggleMinified}
            aria-label="Déverrouiller le menu"
            className="minify-unlock-btn"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-teal)',
              padding: 6,
              display: 'none',
              alignItems: 'center',
              transition: 'color 150ms',
            }}
          >
            <Lock size={18} />
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label={drawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={drawerOpen}
            className={`hamburger-btn ${drawerOpen ? 'open' : ''}`}
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
          visibility: drawerOpen ? 'visible' : 'hidden',
          transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), visibility 250ms',
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
          aria-label="Activer le mode compact"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 20,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text)',
            padding: '8px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: 'fit-content',
            margin: '12px auto 0',
            transition: 'background 150ms, border-color 150ms',
          }}
        >
          <Unlock size={14} style={{ color: 'var(--color-teal)' }} />
          <span style={{ fontWeight: 500 }}>Menu Compact (icônes)</span>
        </button>
      </nav>

      <style>{`
        .header-nav    { display: flex; }
        .logo-short    { display: none; }
        .logo-full     { display: inline; }
        .minified-mobile-nav { display: none; }
        .minify-unlock-btn   { display: none; }

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
          
          /* Header minified styles on mobile */
          .header-minified .logo-full {
            display: none !important;
          }
          .header-minified .logo-short {
            display: inline !important;
          }
          .header-minified .minified-mobile-nav {
            display: flex !important;
            opacity: 0;
            animation: fadeIn 0.2s ease forwards;
          }
          .header-minified .minify-unlock-btn {
            display: flex !important;
          }
          .header-minified .hamburger-btn {
            display: none !important;
          }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
