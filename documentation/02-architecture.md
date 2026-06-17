# 02 — Architecture et Découpage du Projet

Ce document présente l'organisation physique et conceptuelle des fichiers du frontend Next.js, en explicitant le rôle de chaque dossier et la répartition des responsabilités entre les composants.

---

## 📁 Structure Globale du Répertoire

L'arborescence du frontend `front-loicbonin/` respecte les standards de Next.js (App Router) avec un répertoire applicatif `/src` :

```text
front-loicbonin/
├── src/
│   ├── app/                  # Points d'entrée de routage (Next.js App Router)
│   │   ├── article/[slug]/   # Page de détail d'un article de veille (RSC)
│   │   ├── code/             # Galerie et visualiseur de code (RSC + Client)
│   │   ├── profil/           # Page de profil/CV en ligne (RSC)
│   │   ├── realisations/     # Galerie des projets réalisés (RSC)
│   │   ├── globals.css       # Design tokens et système de design CSS global
│   │   ├── layout.tsx        # Layout racine (initialisation du thème et SEO)
│   │   └── page.tsx          # Page d'accueil (flux d'articles, catégories et filtres RSC)
│   │
│   ├── components/           # Composants réutilisables découpés par domaine
│   │   ├── article/          # Cartes d'articles, articles mis en avant, etc.
│   │   ├── code/             # Arborescence de fichiers, coloration syntaxique, éditeur interactif
│   │   ├── layout/           # En-tête, barre latérale et footer
│   │   └── ui/               # Éléments graphiques atomiques (theme toggle, squelettes)
│   │
│   ├── lib/                  # Logique métier isolée (indépendante de l'affichage)
│   │   ├── api.ts            # Client d'API et validation réseau avec mocks
│   │   ├── highlight.ts      # Utilitaire pour Shiki (coloration syntaxique)
│   │   ├── theme.ts          # Script et helpers de gestion du thème (localStorage)
│   │   ├── types.ts          # Contrats d'interfaces TypeScript
│   │   └── validation.ts     # Schémas de validation Zod stricts (ULIDs, dates YYYY-MM-DD)
│
├── public/                   # Ressources statiques (images, CV, feed.xml, etc.)
└── documentation/            # Fichiers explicatifs du projet (ce dossier)
```

---

## 🚦 Frontières : Server Components vs Client Components

Next.js 16 (App Router) sépare le rendu côté serveur (RSC) de l'interactivité côté client. Le projet applique cette séparation de manière rigoureuse :

### 1. React Server Components (RSC) par défaut
* **Principe** : Tous les composants sont par défaut rendus sur le serveur. Cela améliore le score SEO, réduit le JavaScript envoyé au client et optimise le chargement initial.
* **Exemple** : Les pages statiques ou de pur affichage de contenu consomment les données directement sur le serveur dans les composants de page (ex : `/app/page.tsx`, `/app/article/[slug]/page.tsx`).

### 2. Client Components (`"use client"`) pour l'interactivité feuille
* **Principe** : La directive `"use client"` est positionnée uniquement sur les composants feuilles qui requièrent l'utilisation de hooks React (`useState`, `useEffect`) ou d'événements utilisateur (clics, saisie).
* **Exemples** :
  * `ThemeToggle` : Nécessite l'accès à l'API du navigateur (`localStorage`).
  * `CodeEditorClient` : Gère l'état interactif de l'éditeur de code (visualisation de fichiers et d'onglets).
* **Routage et Filtrage** : Le tri des articles, la sélection de tags ou la pagination s'effectuent par routage déclaratif par URL (liens `<Link>`). La page d'accueil reste donc un Server Component pur qui reçoit les filtres via ses `searchParams`, effectuant la récupération de données et le rendu côté serveur sans persistance d'états clients complexes.

---

## 📍 Routage Dynamique Asynchrone (Next.js 16 / React 19)

Conformément aux spécifications récentes de Next.js, les paramètres de route dynamique (`params`) et de requêtes (`searchParams`) sont résolus de manière asynchrone pour éviter les avertissements d'hydratation.

Dans `src/app/article/[slug]/page.tsx` :
* La signature du composant reçoit une promesse : `params: Promise<{ slug: string }>`.
* La valeur est résolue en effectuant un `await` directement sur la promesse de paramètres :

```tsx
// src/app/article/[slug]/page.tsx

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    // Rendu d'état introuvable...
  }

  return (
    <div>
      {/* Rendu du contenu de l'article */}
    </div>
  )
}
```
Cette architecture asynchrone garantit la compatibilité du projet avec le compilateur React 19 et les versions futures de Next.js.
