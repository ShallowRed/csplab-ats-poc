# CSPLab ATS POC

POC d'un Applicant Tracking System (ATS) pour le secteur public français utilisant Vue 3 et le Design Système de l'État (DSFR).

## Objectif

Valider une architecture UI 3 couches pour une app métier CSPLab conforme au DSFR et maintenable à long terme.

Détails architecturaux et décisions : voir [docs/decisions/ats-ui-choix-implementation.md](docs/decisions/ats-ui-choix-implementation.md).

## Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| Vue | 3.5 | Framework UI |
| Vite | 6 | Build tool (LTS) |
| TypeScript | 6 (strict) | Type safety |
| Vue Router | 4 | Routing |
| Pinia | 3 | State management |
| Tailwind CSS | v4 | Utility-first styling |
| Storybook | 8 | Component documentation |
| Vitest | 2 | Unit testing |
| ESLint + Prettier | - | Linting & formatting |

## Architecture 3 Couches

| Couche | Rôle | Fichier |
|--------|------|---------|
| 1 — Tokens DSFR | Source de vérité visuelle (couleurs, typo, espacements, statuts métier) | `src/styles/dsfr-tokens.css` |
| 2 — Primitives headless | Reka UI via shadcn-vue (accessibilité sans style) | `src/components/ui/` |
| 3 — Thème CSPLab | Tailwind v4 `@theme inline` mappé sur les tokens DSFR | `src/styles/theme.css` |

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

### POC 01 — Vue 3 + Reka UI ✅ terminé (lots 0–14)

| Lot | Contenu | Statut |
|-----|---------|--------|
| Lot 0 | Bootstrap : Vite, Tailwind v4, tokens DSFR, Storybook, Vitest | ✅ |
| Lot 1 | shadcn-vue : Button, Badge, Dialog, Drawer, Tabs, Combobox… | ✅ |
| Lot 2 | Types domaine, mock API, stores Pinia | ✅ |
| Lot 3 | App shell, sidebar, header contextuel, routing | ✅ |
| Lot 4 | Kanban pipeline (DnD souris + clavier) | ✅ |
| Lot 5 | Table candidatures (TanStack, filtres, sélection bulk) | ✅ |
| Lot 6 | Fiche candidat (drawer, timeline, Tiptap) | ✅ |
| Lot 7 | Planification entretien (slide-over) | ✅ |
| Lot 8 | Formulaire d'évaluation | ✅ |
| Lot A/B/C | Alignement DSFR (focus, radius, boutons), migration icônes Remix | ✅ |
| Lot 10 | Consolidation routing, EmptyState, breadcrumb | ✅ |
| Lot 11 | Gestion des offres (list, détail, CRUD) | ✅ |
| Lot 12 | Paramètres (étapes, motifs de refus, templates, intervieweurs) | ✅ |
| Lot 14 | Tableau de bord RH (KPIs, todo, délais étapes) | ✅ |

### POC 03 — React + ui-kit Suite numérique 🔜 à démarrer

Réplique fonctionnelle sur stack React 19 + ui-kit Suite numérique pour comparatif terrain. Voir [docs/pilotage/poc-03-react-suite-ui-kit.md](docs/pilotage/poc-03-react-suite-ui-kit.md).

## Documentation

La documentation de cadrage (décisions architecturales, sessions de recherche, pilotage POC) est dans le dossier `docs/` (submodule git privé) :

```
docs/
  index.md                          # Table des matières
  decisions/
    ats-ui-choix-implementation.md  # ADR principal (architecture 3 couches)
  recherche/                        # 5 sessions d'exploration pre-POC
    session-01-benchmark-headless.md
    session-02-audit-tokens-dsfr.md
    session-03-audit-ui-kit.md
    session-04-vue-composants-ats.md
    session-05-analyse-ui-ats-reference.md
  pilotage/                         # Plans et suivi POC
    session-06-synthese-specs-poc.md
    poc-01-plan-execution.md
    poc-02-plan-extension.md
    poc-03-react-suite-ui-kit.md
```

> **Note** : `docs/` est un submodule git pointant vers un repo privé. Pour le cloner avec la doc : `git clone --recurse-submodules`.

## Notes Techniques

- **Vite 6 (LTS)** : `@tailwindcss/vite@4.0.0` est incompatible avec Vite 7+. Stack bloquée sur Vite 6 + Storybook 8.
- **Fonte Marianne** : non incluse. Fallback `arial, sans-serif`. Intégration prévue au Lot 9.

## Licence

Propriétaire — CSPLab / beta.gouv.fr

