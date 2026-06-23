# loicbonin.com — Frontend (Next.js)

Dépôt front-end officiel du site et blog de veille technologique de **Loïc Bonin**, développeur full-stack. Construit avec des technologies modernes et performantes de l'écosystème React et Next.js (2026), ce projet se distingue par sa sobriété esthétique, sa fluidité et sa rigueur architecturale.

Le backend associé est propulsé par [Laravel](https://laravel.com).

---

## ✨ Fonctionnalités Clés

- **Portfolio & Profil Dynamique** : Présentation du parcours (Timeline), compétences, et formations, activables ou désactivables à la demande via l'administration du site.
- **Réalisations / Projets** : Liste des projets phares avec tags, descriptions et liens de démonstration.
- **Explorateur de Code Interactif** : Visualisation de l'arborescence des fichiers du projet directement dans l'application avec coloration syntaxique moderne (Shiki).
- **Blog de Veille Technologique** : Articles de blog classés par catégories et mots-clés (tags).
- **Gestion Sombre / Clair Native** : Transition sans flash lumineux à l'aide des CSS variables modernes.
- **Validation Strict à la Frontière** : Validation défensive des types de données reçus de l'API Laravel en utilisant des schémas de validation [Zod](https://zod.dev).

---

## 🛠️ Stack Technique

- **Framework principal** : [Next.js 16 (App Router)](https://nextjs.org/)
- **Bibliothèque UI** : [React 19](https://react.dev/)
- **Langage** : [TypeScript 5.7+](https://www.typescriptlang.org/)
- **Style & Mise en page** : [Tailwind CSS v4 (PostCSS)](https://tailwindcss.com/) & CSS natif pour une performance maximale
- **Coloration de Code** : [Shiki](https://shiki.matsu.io/)
- **Validation** : [Zod](https://zod.dev/)

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** : version `20.x` ou supérieure
- **pnpm** : version `9.x` ou supérieure

### Installation

Clonez le dépôt, accédez au dossier `front-loicbonin`, et installez les dépendances :

```bash
cd front-loicbonin
pnpm install --frozen-lockfile
```

### Configuration

Créez un fichier `.env.local` pour définir l'URL de votre API backend Laravel (par défaut `http://localhost:8000/api/v1`) :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Lancement en Développement

Pour lancer le serveur de développement local :

```bash
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

### Build de Production

Pour valider le typage TypeScript et compiler le projet pour la production :

```bash
pnpm build
pnpm start
```

---

## 📂 Structure du Projet

L'arborescence suit les standards modernes de Next.js `src/` :

```text
front-loicbonin/
├── documentation/      # Documentation technique interne détaillée
├── public/             # Fichiers statiques (images, PDF du CV, etc.)
└── src/
    ├── app/            # Routage Next.js (App Router)
    │   ├── code/       # Pages de l'explorateur de code
    │   ├── profil/     # Page Profil & compétences
    │   └── realisations# Page de la liste des projets
    ├── components/     # Composants d'interface (layout, boutons, etc.)
    └── lib/            # Configuration de l'API, schémas Zod et types
        ├── api.ts      # Client API avec mécanisme de fallback sur Mocks
        ├── types.ts    # Définitions des interfaces TypeScript
        └── validation.ts # Schémas Zod pour la frontière réseau
```

---

## 📚 Liens Utiles vers la Documentation Interne

Pour approfondir le fonctionnement du projet, veuillez consulter les documents dans le dossier [documentation](./documentation) :

1. [Stack Technique](./documentation/01-stack.md) : Pourquoi et comment les outils ont été choisis et configurés.
2. [Architecture & Composants](./documentation/02-architecture.md) : Découpage Server/Client components et arborescence.
3. [Conventions & Design System](./documentation/03-conventions.md) : Gestion de la dette technique ("ponytail"), thème sombre/clair et règles de style.
4. [Intégration API & Zod](./documentation/04-api-integration.md) : Cache, sécurité réseau, gestion ISR et typage défensif.
