# 04 — Intégration de l'API REST et Validation de Données

Ce document décrit comment le frontend Next.js communique de manière sécurisée avec le backend Laravel 13, valide les formats de réponse, et gère le cache de production.

---

## 🔒 Sécurisation et Variables d'Environnement

Le frontend ne contient aucun secret ni aucune URL codée en dur. Les requêtes réseau s'appuient sur des variables d'environnement configurées au déploiement.

- **Variable principale** : `NEXT_PUBLIC_API_URL`
- **Valeur locale** (développement) : `http://localhost:8000/api/v1`
- **Valeur production** : `https://api.loicbonin.dev/api/v1`

Toutes les requêtes asynchrones transitent par le client unifié défini dans [src/lib/api.ts](/front-loicbonin/src/lib/api.ts).

---

## 🛡️ Architecture Défensive : Validation Réseau avec Zod

Pour éviter que des changements de format ou des régressions inattendues dans le backend Laravel 13 ne provoquent des crashs silencieux d'affichage côté client, le frontend applique un schéma de validation strict à la frontière réseau dans [src/lib/validation.ts](/front-loicbonin/src/lib/validation.ts).

### Définition des Schémas de Validation

Les types TypeScript de [src/lib/types.ts](/front-loicbonin/src/lib/types.ts) possèdent des schémas de validation Zod stricts :

```typescript
import { z } from "zod";

// Correspond au contrat d'API du backend Laravel
export const ULIDSchema = z
  .string()
  .regex(/^[0-9A-HJKMNP-TV-Z]{26}$/i, "Format ULID invalide");
export const DateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)");

export const ArticleSchema = z.object({
  id: ULIDSchema, // Validation du format ULID de 26 caractères
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(), // Markdown brut retourné par le backend
  category: z.string(), // Nom ou slug de la catégorie
  tags: z.array(z.string()), // Liste des tags associés
  publishedAt: DateStringSchema, // Date de publication stricte (YYYY-MM-DD)
  readingTime: z.number().nonnegative(),
  featured: z.boolean().optional(),
});
```

---

## 🔄 Validation Réseau Centralisée

Afin d'unifier la gestion des erreurs de typage à l'exécution, le client d'API intègre une fonction utilitaire de validation centralisée :

```typescript
// src/lib/api.ts

function validateData<T>(
  schema: z.ZodType<T>,
  data: unknown,
  contextName: string,
): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    console.error(
      `[API Network Frontier Validation Error in ${contextName}]:`,
      parsed.error.format(),
    );
    throw new Error(
      `La validation réseau de l'API a échoué pour : ${contextName}`,
    );
  }
  return parsed.data;
}
```

Toutes les fonctions d'appels API (ex : `getArticles()`, `getArticleBySlug()`) utilisent cette méthode avant de retourner les données typées aux composants de l'application :

```typescript
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // fetch ou lecture locale
  const data = MOCK_ARTICLES.find((a) => a.slug === slug) ?? null;
  return validateData(ArticleSchema.nullable(), data, "getArticleBySlug");
}
```

---

## ⚡ Stratégie de Mise en Cache et Révalidation (ISR)

Puisque le site de veille est essentiellement destiné à la lecture de contenu, le frontend exploite le mécanisme de **Régénération Statique Incrémentale (ISR)** de Next.js.

1. **Génération au Build** : Au moment de la compilation (`pnpm build`), Next.js appelle l'API Laravel pour pré-générer les pages d'articles sous forme de HTML statique.
2. **Revalidation en arrière-plan** : Lorsqu'un utilisateur demande une page pré-générée, Next.js lui sert instantanément la version du cache CDN. Si la page a plus de 5 minutes, Next.js déclenche en arrière-plan une nouvelle requête vers l'API Laravel pour régénérer la page avec les dernières modifications de Filament sans impacter le temps de chargement pour l'utilisateur courant.
3. **Invalidation à la demande** : Pour forcer la mise à jour immédiate d'un article édité sur Filament, un webhook d'invalidation (Route Handler Next.js) peut être configuré pour appeler `revalidatePath('/article/[slug]')` dès la modification enregistrée dans le panel d'administration.

---

## 💻 Explorateur de Code Multi-Projets

L'explorateur de code (`/code`) interroge le backend Laravel pour obtenir la liste des projets de code disponibles ainsi que leur arborescence récursive :

- **Endpoints utilisés** :
  - `GET /api/v1/code/projects` : Liste les projets (nom, description, slug).
  - `GET /api/v1/code/projects/{slug}/tree` : Récupère l'arborescence complète (dossiers, fichiers et articles liés) pour le projet spécifié.
  - `GET /api/v1/code/files/{path}` : Récupère le contenu brut et les métadonnées d'un fichier de code spécifique.

- **Mécanisme de repli (Fallback)** :
  En cas d'indisponibilité du serveur Laravel ou lors du build statique initial, le client d'API bascule automatiquement sur des données mockées locales (`MOCK_CODE_PROJECTS` et `MOCK_CODE_TREE`) afin d'assurer la résilience de l'application.

---

## 🔗 Liaison Articles & Code Source (Intégration & Redirection)

Le projet implémente une liaison bidirectionnelle stricte entre les articles de veille technologique et l'explorateur de code source.

### 1. Structure de Données de l'API (Article + Code)

Le backend Laravel 13 retourne les objets de code associés directement dans la structure de l'article sous trois clés facultatives :
* `codeFile` : Objet représentant un fichier de code unique (`name`, `path`, `language`, `content`, `projectSlug`).
* `codeFolder` : Objet représentant un dossier (et ses sous-dossiers/fichiers récursifs).
* `codeProject` : Objet représentant le projet de code lié complet.

Ces données sont validées à l'exécution par Zod sur le frontend (`ArticleSchema`) et typées rigoureusement dans `types.ts`.

### 2. Aperçu du Code Source et Coloration Unifiée

* **Coloration des blocs de code** : Tout bloc de code saisi en Markdown (ex : ` ```typescript `) ou issu d'un fichier lié est parsé par `<ArticleProse />` ou rendu par `<AssociatedCodeSection />` en utilisant le composant `<HighlightedCode />` du frontend. Cela assure l'application de la même palette de couleurs (mode sombre/clair) "Watercolor" que celle utilisée dans l'onglet principal de Code.
* **Composant `<AssociatedCodeSection />`** : Si un code source est lié à l'article, un bouton rétractable "Code source associé (...)" s'affiche en fin d'article. Au clic, le code du fichier (ou le premier fichier du dossier/projet) s'affiche directement dans un volet avec coloration syntaxique.

### 3. Redirection Interactive avec Paramètres de Requête

Le composant d'aperçu de code inclut un bouton d'action **"Ouvrir dans l'explorateur de code ↗"** qui redirige l'utilisateur vers :
`/code?project={projectSlug}&file={filePath}`

L'explorateur de code (`<CodeEditorClient />`) :
1. Détecte la présence de ces paramètres de requête (`project` et `file`) via `useSearchParams()`.
2. Résout le projet et lance automatiquement la récupération asynchrone de son arborescence de fichiers.
3. Repère le fichier ciblé par le paramètre `file` dans l'arborescence, l'active et l'affiche directement dans l'éditeur.

