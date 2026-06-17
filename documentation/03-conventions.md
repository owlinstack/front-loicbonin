# 03 — Conventions de Développement et Standards Visuels

Ce document rassemble les conventions d'écriture du code TypeScript/CSS, détaille la gestion du thème native, et formalise les règles de développement pour le référencement (SEO) et la préservation des React Server Components (RSC).

---

## 🎨 Système de Design CSS et Tokens

Le design du site repose sur un style minimaliste haut de gamme (mode sombre par défaut, contrastes adoucis, typographies fluides).

### 1. Tailwind v4 et PostCSS

Le projet intègre **Tailwind CSS v4** qui utilise des imports natifs CSS pour compiler les styles. Les classes utilitaires Tailwind sont privilégiées pour la mise en page (Flexbox, Grid, espacements standardisés) afin d'éviter la prolifération de fichiers CSS ou de styles en ligne.

### 2. Design Tokens Globaux

Tous les tokens de design (couleurs, polices, tailles de texte réactives) sont définis en CSS pur sous forme de variables globales (`:root`) dans [globals.css](file:///Users/loico/Work/MyDocs/dev/loicbonin.com/front-loicbonin/src/app/globals.css).

```css
:root {
  /* Typography */
  --font-display: "Editorial New", Georgia, serif;
  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", monospace;

  /* Fluid typography */
  --text-xs: clamp(0.75rem, 0.7rem + 0.15vw, 0.8125rem);
  --text-sm: clamp(0.875rem, 0.82rem + 0.2vw, 0.9375rem);
  --text-base: clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem);

  /* Color Palette - Dark (Default) */
  --color-bg: #0c0c0b;
  --color-surface: #131312;
  --color-text: #e8e6e1;
  --color-border: rgba(255, 255, 255, 0.07);
}
```

### 3. Effets Interactive Sans JavaScript (RSC-friendly)

Pour respecter les contraintes de rendu des React Server Components (qui interdisent l'utilisation d'handlers d'événements JavaScript comme `onMouseEnter` ou `onMouseLeave`), toutes les animations et effets de survol interactifs sur les cartes d'articles, les projets ou les boutons doivent être implémentés en CSS pur via la pseudo-classe `:hover` :

```css
/* Bon exemple de carte d'article interactive en CSS natif */
.small-project-card {
  background-color: transparent;
  transition: background-color 150ms;
}
.small-project-card:hover {
  background-color: var(--color-surface);
}
```

---

## 🌓 Gestion du Thème Sombre / Clair (Zéro Flash)

Pour offrir une expérience premium, la bascule de thème évite tout clignotement ou flash blanc lors du rechargement de la page :

1. **Persistance** : Le choix de l'utilisateur est stocké dans le `localStorage` sous la clé `lb-theme`.
2. **Application Synchrone via Script Next.js** : Afin d'éviter le flash visuel pendant que React charge, un script synchrone ultra-léger et bloquant est configuré à l'aide du composant `<Script>` de Next.js avec la stratégie `beforeInteractive`. Il est placé au début du `<body>` dans [layout.tsx](file:///Users/loico/Work/MyDocs/dev/loicbonin.com/front-loicbonin/src/app/layout.tsx) :

   ```tsx
   import Script from 'next/script'

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="fr" data-theme="dark" suppressHydrationWarning>
         {/* ... */}
         <body>
           <Script
             id="theme-script"
             strategy="beforeInteractive"
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
         </body>
       </html>
     )
   }
   ```
3. **Hydratation Sécurisée** : La balise `<html>` utilise l'attribut `suppressHydrationWarning` pour éviter que Next.js ne lève des alertes de décalage d'hydratation entre le HTML brut du serveur et l'attribut `data-theme` injecté côté client avant le rendu de l'interface.

---

## 🔎 Bonnes Pratiques SEO et Sémantique HTML5

La visibilité dans les moteurs de recherche et l'accessibilité sont des priorités absolues dans la structuration des composants :

### 1. Hiérarchie Unique et Sémantique
- **Un seul `<h1>` par page** : Chaque route de l'application doit comporter un unique titre principal `<h1>`. Les sections internes doivent utiliser une structure logique descendante (`<h2>`, puis `<h3>`).
- **Balises Sémantiques structurales** : L'utilisation de `<div>` génériques doit être évitée pour les structures de pages majeures. Privilégier les balises natives :
  - `<header>` pour la barre de navigation supérieure.
  - `<main>` pour envelopper le contenu principal de chaque page.
  - `<aside>` pour les éléments latéraux ou secondaires (barre latérale de filtrage).
  - `<article>` pour entourer chaque carte d'article ou projet indépendant.
  - `<nav>` pour structurer les listes de liens et les filtres.

### 2. Métadonnées Statiques et Dynamiques (Metadata)
- **Métadonnées globales** : L'identité de base et les configurations d'affichage global sont exportées de manière statique via l'objet `metadata` dans le layout racine.
- **Routes Dynamiques** : Les pages dont le titre et le contenu changent selon la base de données (ex : `/article/[slug]`) doivent implémenter et exporter la fonction `generateMetadata` de Next.js pour injecter de manière asynchrone le titre et la description corrects :

  ```tsx
  export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params
    const article = await getArticleBySlug(slug)
    return {
      title: article ? `${article.title} — Loïc Bonin` : "Article non trouvé",
      description: article?.excerpt || "Détail de l'article",
    }
  }
  ```

### 3. Identifiants Uniques pour les Tests et Automatisation
- Chaque élément interactif de premier plan (ThemeToggle, boutons de filtre, pagination, champ d'édition de code) doit obligatoirement posséder un attribut `id` unique et stable pour simplifier les tests d'intégration, de bout en bout, et pour améliorer la navigation par raccourcis ou claviers.

---

## 📊 Gestion de la Dette Technique : Méthodologie "Simplification"

Toutes les simplifications délibérées de code, les données mockées ou les raccourcis de développement temporaires doivent être explicitement documentés de manière homogène.

### Format Obligatoire du Commentaire

Tout raccourci doit comporter un bloc de commentaires décrivant la limite technique et le plan d'évolution futur vers la production :

```typescript
// Simplification: [Description concise du raccourci technique]
// Plafond: [La limite ou contrainte de performance/sécurité de la solution actuelle]
// Plan d'évolution: [Comment migrer proprement cette partie vers la solution cible]
```

### Exemple réel dans le projet (gestion des Mocks) :

```typescript
// Simplification: Mock de données en mémoire.
// Plafond: Les données sont statiques et chargées en local sans persistance ni synchronisation réelle.
// Plan d'évolution: Remplacer ce mock par des appels asynchrones avec fetch natif vers l'API REST de production.
```
