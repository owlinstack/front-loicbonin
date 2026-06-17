import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg)",
        padding: "64px 24px 48px",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 48,
        }}
      >
        {/* Top Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          {/* Logo & Bio */}
          <div style={{ maxWidth: 360 }}>
            <Link
              href="/"
              aria-label="Loïc Bonin — accueil"
              id="footer-logo-link"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-base)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                textDecoration: "none",
                color: "var(--color-text)",
                display: "block",
                marginBottom: 12,
              }}
            >
              Loïc Bonin
            </Link>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Développeur Fullstack spécialisé en PHP (Laravel/Symfony) et
              TypeScript (React/Next.js/Vue.js). Passionné de veille
              technologique et de mentorat.
            </p>
          </div>

          {/* Links columns */}
          <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
            {/* Navigation */}
            <nav
              aria-label="Navigation secondaire"
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-text)",
                  margin: "0 0 4px",
                }}
              >
                Navigation
              </p>
              <Link id="footer-nav-veille" href="/" className="footer-link">
                Veille
              </Link>
              <Link
                id="footer-nav-realisations"
                href="/realisations"
                className="footer-link"
              >
                Réalisations
              </Link>
              <Link id="footer-nav-code" href="/code" className="footer-link">
                Code
              </Link>
              <Link
                id="footer-nav-profil"
                href="/profil"
                className="footer-link"
              >
                Profil
              </Link>
            </nav>

            {/* Socials / Pro */}
            <nav
              aria-label="Réseaux professionnels"
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-text)",
                  margin: "0 0 4px",
                }}
              >
                Contact & Réseaux
              </p>
              <a
                id="footer-social-github"
                href="https://github.com/owlinstack"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                GitHub ↗
              </a>
              <a
                id="footer-social-linkedin"
                href="https://www.linkedin.com/in/loicbonin/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                LinkedIn ↗
              </a>
              <a
                id="footer-social-email"
                href="mailto:loic.bonin@gmail.com"
                className="footer-link"
              >
                Email ↗
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            © {currentYear} Loïc Bonin. Tous droits réservés.
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            Fait à Lyon, France
          </span>
        </div>
      </div>

      <style>{`
        .footer-link {
          font-family: var(--font-sans);
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          text-decoration: none;
          transition: color 150ms;
        }
        .footer-link:hover {
          color: var(--color-text);
        }
      `}</style>
    </footer>
  );
}
