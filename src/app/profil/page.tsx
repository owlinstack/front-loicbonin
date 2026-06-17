import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import { getProfile } from "@/lib/api";

export default async function ProfilPage() {
  const profile = await getProfile();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
      <Header />

      <main
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "56px 24px 96px",
        }}
      >
        {/* Hero name & Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          {profile.avatarUrl && (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              width={200}
              height={200}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                flexShrink: 0,
              }}
            />
          )}

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-hero)",
              fontWeight: 400,
              color: "var(--color-text)",
              lineHeight: 1.0,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {profile.name}
          </h1>
        </div>

        {/* Bio */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-base)",
            color: "var(--color-text-muted)",
            lineHeight: 1.75,
            marginBottom: 64,
          }}
        >
          {profile.bio}
        </p>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--color-border)",
            marginBottom: 48,
          }}
        />

        {/* Skills — definition list style */}
        <section aria-label="Compétences" style={{ marginBottom: 64 }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              marginBottom: 32,
            }}
          >
            Compétences
          </p>
          <dl>
            {profile.skills.map((skill, i) => (
              <div
                key={skill.term}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "0 32px",
                  marginBottom: i < profile.skills.length - 1 ? 28 : 0,
                  alignItems: "baseline",
                }}
              >
                <dt
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    color: "var(--color-text)",
                    paddingTop: 3,
                  }}
                >
                  {skill.term}
                </dt>
                <dd
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.7,
                  }}
                >
                  {skill.description}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--color-border)",
            marginBottom: 48,
          }}
        />

        {/* Timeline */}
        <section aria-label="Parcours" style={{ marginBottom: 64 }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              marginBottom: 32,
            }}
          >
            Parcours
          </p>
          <ol style={{ listStyle: "none" }}>
            {profile.timeline.map((item, i) => (
              <li
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "0 32px",
                  marginBottom: i < profile.timeline.length - 1 ? 32 : 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    letterSpacing: "0.04em",
                    paddingTop: 3,
                    lineHeight: 1.4,
                  }}
                >
                  {item.date}
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      color: "var(--color-text)",
                      marginBottom: 4,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {profile.education && profile.education.length > 0 && (
          <>
            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--color-border)",
                marginBottom: 48,
              }}
            />

            {/* Education */}
            <section aria-label="Éducation" style={{ marginBottom: 64 }}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  marginBottom: 32,
                }}
              >
                Éducation
              </p>
              <ol style={{ listStyle: "none" }}>
                {profile.education.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 1fr",
                      gap: "0 32px",
                      marginBottom: i < profile.education.length - 1 ? 32 : 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-muted)",
                        letterSpacing: "0.04em",
                        paddingTop: 3,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.date}
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          color: "var(--color-text)",
                          marginBottom: 4,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--text-sm)",
                          color: "var(--color-text-muted)",
                          lineHeight: 1.65,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}

        {/* CV link */}
        {profile.cvUrl && (
          <a href={profile.cvUrl} className="cv-link">
            Télécharger le CV →
          </a>
        )}
      </main>

      <Footer />

      <style>{`
        .cv-link {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 150ms, text-decoration-color 150ms;
        }
        .cv-link:hover {
          color: var(--color-text);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
