# 01 — Stack Technique du Frontend

Ce document liste la pile technologique (stack) du projet, les versions majeures retenues, et justifie les choix architecturaux afin de garantir une application performante, accessible et pérenne.

---

## 🛠️ Composants de la Stack

| Technologie      | Version  | Rôle dans le projet                           | Justification technique                                                                                                                           |
| :--------------- | :------- | :-------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Next.js**      | `16.2.x` | Framework d'application hybride (App Router). | Gestion optimisée du routage, des Server Components (RSC), du référencement (SEO), et du rendu hybride (SSR / ISR).                               |
| **React**        | `19.2.x` | Bibliothèque de composants UI.                | Utilisation des dernières API de React 19 (transitions, hooks asynchrones, et intégration native de `use()` pour la gestion des promesses).       |
| **Tailwind CSS** | `4.3.x`  | Cadre de stylisation (Utility-First CSS).     | Utilisation du compilateur v4 ultra-rapide basé sur Rust, suppression du boilerplate de configuration via l'import direct de directives CSS.      |
| **TypeScript**   | `5.7.x`  | Langage de programmation typé.                | Typage strict pour détecter les erreurs au moment de la compilation et standardiser les interfaces de données.                                    |
| **Zod**          | `4.4.x`  | Validation de schéma à l'exécution.           | Sécurisation et validation défensive des données externes à la frontière réseau (API REST).                                                       |
| **Shiki**        | `4.2.x`  | Coloration syntaxique haut de gamme.          | Moteur de rendu de code (utilisé dans la galerie de code) garantissant un affichage de qualité IDE sans surcoût de bundle client (rendu serveur). |

---

## 💡 Principes de Choix Technologiques

### 1. Approche "Lazy Dev" (YAGNI & Sobriété)

Le principe fondamental de développement du projet est la sobriété de code : **"le meilleur code est celui qui n'est pas écrit"**.

- **Zéro Boilerplate** : Pas de bibliothèques de gestion d'état global lourdes (ex: Redux) tant qu'un état local ou l'API de contexte native de React suffit.
- **Pas de bibliothèques UI tierces complexes** : Les éléments interactifs comme la bascule de thème sombre/clair sont écrits en JavaScript/CSS purs sans surcharger le bundle de dépendances lourdes.

### 2. Typage Strict de Bout en Bout

Afin d'offrir une base de code lisible :

- Le type `any` est formellement banni.
- Toutes les interfaces de données (articles, projets, profil) sont centralisées et documentées dans [types.ts](../src/lib/types.ts).

### 3. Exploitation Native du Rendu Serveur (RSC) et du Routage par URL

Toute l'application est configurée en Server Components par défaut. Pour éliminer la nécessité de clients de récupération et de synchronisation d'état comme SWR ou React Query, le projet utilise exclusivement la puissance native de Next.js :

- **Rendu Serveur Direct** : Les pages récupèrent directement les données de manière asynchrone côté serveur lors de l'exécution du rendu.
- **Routage Déclaratif par URL** : La sélection de filtres, catégories ou pages utilise des paramètres d'URL (`searchParams`). Next.js effectue un re-rendu partiel et serveur ultra-rapide sans perte de position de défilement, éliminant les états clients superflus et réduisant considérablement la taille finale du bundle JavaScript envoyé au navigateur.
