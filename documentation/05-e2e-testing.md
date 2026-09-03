# Tests End-to-End (E2E) avec Playwright

Ce document détaille la stratégie, l'architecture et l'utilisation des tests E2E pour le projet `loicbonin.com` (Frontend Next.js).

---

## 🎯 Objectifs & Philosophie

Les tests E2E valident l'expérience utilisateur complète en simulant les parcours réels dans un navigateur (Chromium, WebKit, Firefox, Mobile) :
- **Navigation & Routing** : Vérification des routes principales, responsive header, menu mobile, et page 404.
- **Flux Articles / Blog** : Parcours de lecture, filtrage par catégorie/tag, rendu du Markdown et coloration de syntaxe (Shiki).
- **Portfolio & Profil** : Affichage des projets, tags technologiques, timeline et compétences.
- **Thème UI** : Bascule du thème clair/sombre (`data-theme`), synchronisation CSS variables et persistance `localStorage`.

---

## 🏗️ Architecture Page Object Model (POM)

Pour garantir la maintenabilité des tests et éviter la duplication de sélecteurs, la suite de test utilise le pattern **Page Object Model** :

```text
e2e/
├── pages/                  # Abstractions des pages et composants
│   ├── BasePage.ts         # Navigation globale, header, footer, thème
│   ├── HomePage.ts         # Page d'accueil & grille d'articles
│   ├── ArticlesPage.ts     # Liste & filtres de blog
│   ├── ArticleDetailPage.ts# Page de lecture d'un article
│   ├── RealisationsPage.ts # Portfolio des projets
│   ├── ProfilPage.ts       # CV & compétences
│   └── CodeExplorerPage.ts # Explorateur de code interactif
└── specs/                  # Scénarios de tests E2E
    ├── navigation.spec.ts
    ├── articles-flow.spec.ts
    ├── portfolio-flow.spec.ts
    ├── theme-toggle.spec.ts
    └── code-explorer.spec.ts
```

---

## 🚀 Commandes d'Exécution

Tous les scripts s'exécutent depuis le dossier `front-loicbonin/` avec **pnpm** :

### 1. Exécution standard (Headless)
Lance tous les tests E2E en parallèle en arrière-plan :
```bash
pnpm test:e2e
```

### 2. Interface interactive (Playwright UI)
Ouvre l'interface graphique Playwright avec time-travel debugging, inspecteur d'éléments et rechargement à chaud :
```bash
pnpm test:e2e:ui
```

### 3. Exécution avec navigateur visible
```bash
pnpm test:e2e:headed
```

### 4. Visualisation du rapport HTML
Affiche le rapport détaillé des résultats, captures d'écran et traces réseau :
```bash
pnpm test:e2e:report
```

---

## ⚙️ Configuration (`playwright.config.ts`)

- **WebServer automatique** : Playwright démarre et attend la disponibilité du serveur de dev Next.js (`http://localhost:3000`) si celui-ci n'est pas déjà lancé.
- **Capture sur échec** : Les traces (`trace: 'on-first-retry'`), vidéos et screenshots sont automatiquement enregistrés en cas d'échec pour faciliter l'analyse post-mortem.
- **Multi-navigateurs** : Configuration pour Desktop Chrome et Mobile Chrome (Pixel 5).

---

## 🔄 Intégration Continue (CI / Docker)

Pour exécuter les tests dans un environnement conteneurisé ou une CI GitHub Actions :
```bash
# Avec variables d'environnement
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000 pnpm test:e2e
```
