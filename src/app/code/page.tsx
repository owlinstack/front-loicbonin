import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { getCodeProjects, getGithubProjects } from "@/lib/api";
import { CodeEditorClient } from "@/components/code/CodeEditorClient";

export const metadata: Metadata = {
  title: "Explorateur de Code",
  description:
    "Explorez les ressources disponibles en lignes de code des articles ou des projets et découvrez mes répertoires GitHub.",
  alternates: {
    canonical: "/code",
  },
};

export default async function CodePage() {
  const [projects, githubProjects] = await Promise.all([
    getCodeProjects(),
    getGithubProjects(),
  ]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Suspense
        fallback={
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="spinner" />
          </div>
        }
      >
        <CodeEditorClient projects={projects} githubProjects={githubProjects} />
      </Suspense>
    </div>
  );
}
