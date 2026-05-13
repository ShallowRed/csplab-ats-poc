---
title: DDR-001 — Couches de composition et frontières
created: 2026-05-12
status: accepté
---

## Contexte

Un design system ATS accumule rapidement des dizaines de composants — atomes, molécules,
sections et pages — sans que leur niveau de composition soit toujours explicite. Plusieurs
composants se retrouvent à la frontière entre des catégories (atome/molécule, molécule/section),
et chaque ajout force une décision implicite. À mesure que la base grandit, l'absence de
règle de classement produit deux effets : des composants similaires sont placés à des
niveaux différents, et des duplications apparaissent.

Il faut une grille de lecture stable, indépendante du framework UI sous-jacent et
exprimable dans le Storybook.

## Décision

Sept couches numérotées, lisibles directement dans la sidebar du Storybook :

| Couche | Caractéristique distinctive |
|---|---|
| **01 Fondations** | Pas un composant : tokens, échelles, palettes, états transverses |
| **02 Atomes** | Une seule responsabilité, API plate (props scalaires), aucune connaissance du domaine |
| **03 Molécules** | Composition d'atomes via slots ou sous-composants, toujours générique |
| **04 Composants métier** | Atomes ou molécules spécialisés pour le domaine ATS (statuts, scores, étapes) |
| **05 Sections génériques** | Blocs fonctionnels d'une webapp métier, réutilisables hors ATS (sidebar, toolbar) |
| **06 Sections ATS** | Assemblages métier riches portant un cas d'usage complet (kanban, fiche) |
| **07 Vues ATS** | Pages assemblées avec mock data, équivalent visuel d'une route |

### Critères de classement

- Un composant **monte** d'une couche dès qu'il introduit l'un de ces éléments :
  - un slot nommé (atome → molécule),
  - une référence à un type métier (`Candidature`, `Offre`, `Etape`) — sauf wrapper trivial
    (molécule → composant métier),
  - une consommation directe d'un store Pinia (molécule → section),
  - un assemblage de plusieurs sections (section → vue).
- Un composant **reste atome** s'il n'a que des props scalaires et un slot par défaut
  optionnel (cas de `Button`, `Badge`, `Tag`).

### Frontière « générique vs ATS » pour les sections

Une section est **générique** si elle pourrait apparaître dans n'importe quelle webapp
métier (`Sidebar`, `PageToolbar`, `BulkActionBar`). Elle est **ATS** si son rôle UX est
spécifique au métier (`KanbanBoard` pour pipeline de recrutement, `EvaluationForm` pour
notation post-entretien). Le critère pratique : la section générique pourrait être
extraite telle quelle dans une bibliothèque inter-produits.

## Conséquences

- Toute story déclare son titre selon le pattern `NN — Couche/Catégorie/Composant`. La
  numérotation force l'ordre dans la sidebar Storybook (zero-config).
- Les composants métier transverses (`KpiCard`) ne sont pas en couche 03 : leur valeur
  vient de leur ancrage domaine, même si l'API technique reste simple.
- Les duplications cross-couches sont chassées au passage : si deux composants partagent
  90 % de leur logique mais vivent dans deux couches, la couche basse l'emporte et la
  couche haute devient un consommateur.
- Le découpage facilite la migration future du UI kit : les couches 01-03 sont les seules
  exposées à un changement de framework (Reka, shadcn-vue, Cunningham). Les couches 04+
  restent stables tant que la logique métier ne change pas.

## Alternatives écartées

- **Atomic Design strict (atoms / molecules / organisms / templates / pages)** — la
  frontière organisme/template est floue dans une webapp métier dense ; la distinction
  « générique webapp vs ATS » est plus utile au quotidien que « avec ou sans data template ».
- **Découpage par feature uniquement** (`pipeline/`, `candidatures/`, `entretiens/`) —
  perd l'axe « échelle de composition », ce qui empêche de raisonner sur la réutilisation
  inter-features.
- **Découpage à 4 couches** (atomes / molécules / organismes / pages) — colle moins bien
  à la réalité observée : les organismes ATS sont trop hétérogènes (`KanbanBoard` et
  `KpiCard` n'ont pas le même poids ni la même fréquence d'usage).
