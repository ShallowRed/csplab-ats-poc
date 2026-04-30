# CSPLab ATS POC

POC d'un Applicant Tracking System (ATS) pour le secteur public français utilisant Vue 3 et le Design Système de l'État (DSFR).

## Objectif

Valider une architecture UI 3 couches pour une app métier CSPLab conforme au DSFR et maintenable à long terme.

**Lien vers le plan d'exécution** : `~/Projects/shallowred-garden/agents/workspace-pawn/content/projets/csplab/poc-01-plan-execution.md`

## Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| Vue | 3.5 | Framework UI |
| Vite | 8 | Build tool |
| TypeScript | 6 (strict) | Type safety |
| Vue Router | 4 | Routing |
| Pinia | 3 | State management |
| Tailwind CSS | v4 | Utility-first styling |
| Storybook | 10 | Component documentation |
| Vitest | 4 | Unit testing |
| ESLint + Prettier | - | Linting & formatting |

## Architecture 3 Couches

### Couche 1 : Tokens DSFR

Source de vérité visuelle — Tokens design extraits du DSFR v1.14.4 :
- Couleurs sémantiques (action, success, warning, error, info)
- 7 statuts métier CSPLab
- Échelle typographique
- Espacements, radius, ombres, z-index

Fichier : `src/styles/dsfr-tokens.css`

### Couche 2 : Primitives headless (Lot 1)

À installer au Lot 1 : Reka UI via shadcn-vue (composants accessibles sans style).

### Couche 3 : Thème CSPLab

Tailwind v4 utility-first mappé sur les tokens DSFR.  
Fichier : `src/styles/theme.css`

**Note** : Tailwind v4 (`@tailwindcss/vite` 4.0.0) n'est pas officiellement compatible avec Vite 8. Installation avec `--legacy-peer-deps` réussie, fonctionnel en pratique.

## Commandes

```bash
# Développement
npm run dev

# Tests
npm test                # Run tous les tests (avec coverage)
npm run test:watch      # Mode watch

# Linting / Formatting
npm run lint
npm run lint:fix
npm run format

# Type checking
npm run typecheck

# Build
npm run build
npm run preview

# Storybook
npm run storybook
npm run build-storybook
```

## Statut

✅ **Lot 0 terminé**

Fondations posées :
- Architecture 3 couches définie
- Tokens DSFR v1.14.4 intégrés (sans fonte Marianne, fallback arial)
- Tailwind v4 configuré (mapping tokens → utils)
- Structure de dossiers pour les 10 lots
- App de smoke test fonctionnelle
- Storybook 10 configuré avec story de référence (Tokens)
- Vitest + ESLint + Prettier opérationnels

**Prochaine étape** : Lot 1 — Installation shadcn-vue + primitives headless (Button, Badge, Select, Dialog, DataTable).

## Notes Techniques

### Compatibilité Tailwind v4 + Vite 8

`@tailwindcss/vite` 4.0.0 déclare `peerDependencies: vite ^5.2.0 || ^6`, mais Vite 8 fonctionne avec `--legacy-peer-deps`. Aucun bug constaté en développement. À surveiller en production.

### Fonte Marianne

Les fichiers `.woff2` Marianne ne sont pas inclus dans ce Lot. Le `@font-face` est commenté dans `dsfr-tokens.css`. Fallback : `arial, sans-serif`. Intégration prévue au **Lot 9**.

### Storybook avec Playwright

Storybook 10 a installé Playwright + Chromium pour les tests visuels (addon-vitest). Non utilisé dans ce Lot mais disponible pour les suivants.

## Licence

Propriétaire — CSPLab / beta.gouv.fr

