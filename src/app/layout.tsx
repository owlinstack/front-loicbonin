import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BlogRagChatWidget } from "@/components/chat/BlogRagChatWidget";
import { getProfile } from "@/lib/api";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://loicbonin.com'),
  title: {
    default: "Loïc Bonin — Veille & Portfolio",
    template: "%s — Loïc Bonin",
  },
  description:
    "Veille technologique, réalisations et ressources code de Loïc Bonin, développeur.",
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0b" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  return (
    <html lang="fr" data-theme="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=editorial-new@400,500&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('lb-theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch(e) {}
            `,
          }}
        />
        {children}
        {profile.ragChatEnabled && <BlogRagChatWidget />}
      </body>
    </html>
  );
}

