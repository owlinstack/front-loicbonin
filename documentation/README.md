# Documentation Frontend — Loïc Bonin

Bienvenue dans la documentation technique du frontend de l'application **loicbonin.com**. Ce projet est un portfolio et blog de veille technologique construit avec les standards modernes de l'écosystème React et Next.js en 2026.

---

## 🧭 Table des Matières

Pour faciliter la prise en main et la maintenance du projet, voici le plan de découpage de la documentation :

| **01** | [Stack Technique](/front-loicbonin/documentation/01-stack.md) | Détail des technologies utilisées (Next.js 16, React 19, Tailwind CSS v4, TypeScript, Zod, Shiki). |
| **02** | [Architecture & Découpage](/front-loicbonin/documentation/02-architecture.md) | Structure de dossiers du projet, routage dynamique asynchrone et frontières Client/Server Components. |
| **03** | [Conventions & Design System](/front-loicbonin/documentation/03-conventions.md) | Normes de typage strict, gestion native du thème sombre/clair sans flash et gestion de la dette technique via les "Simplifications". |
| **04** | [Intégration API & Sécurisation](/front-loicbonin/documentation/04-api-integration.md) | Connexion réseau au backend Laravel 13, validation défensive avec Zod et mise en cache (ISR). |

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** : version `20.x` ou supérieure.
- **pnpm** : version `9.x` ou supérieure (gestionnaire de paquets officiel du projet).

### Installation des Dépendances

À la racine du répertoire `front-loicbonin`, exécutez la commande suivante pour installer les paquets de façon déterministe en respectant le lockfile :

```bash
pnpm install --frozen-lockfile
```

### Lancement du Serveur de Développement

Pour démarrer le serveur de développement local :

```bash
pnpm dev
```

L'application sera accessible à l'adresse : [http://localhost:3000](http://localhost:3000).

### Validation de la Qualité de Code

Avant de soumettre du code ou d'ouvrir une Pull Request, assurez-vous de lancer les outils de validation automatique :

```bash
pnpm lint     # Analyse de code statique (ESLint)
pnpm build    # Compilation de production pour valider les types TypeScript et le build
```
