---
title: DDR-008 — États standards Empty / Loading / Error
created: 2026-05-12
status: accepté
---

## Contexte

Toute vue qui charge des données traverse au moins 4 états : `idle` (rare), `loading`,
`success`, `error`, plus un état dérivé `empty` (succès sans donnée). Ne pas traiter ces
états explicitement produit deux dérives :

1. Pendant le `loading`, l'écran scintille (flash de contenu vide puis liste).
2. L'état `empty` est confondu avec une erreur (« où sont mes candidatures ? »).

## Décision

### Quatre états explicites, par composant de liste/section

Chaque section de liste (`CandidatureTable`, `KanbanBoard`, `CandidateTimeline`, etc.)
expose les 4 états comme des **slots ou des stories Storybook** dédiés. Conventions :

| État | Composant | Indicateurs |
|---|---|---|
| `loading` | `Skeleton` rectangulaire reproduisant la structure (lignes / cartes) | Pas de spinner global, jamais de blocage cliquable |
| `empty` | `EmptyState` molécule | Illustration neutre, libellé contextualisé, CTA principal |
| `error` | `EmptyState` variant `error` | Icône d'avertissement, message d'erreur lisible, CTA « Réessayer » |
| `success` | Contenu réel | Pas de bandeau « X résultats » dans le composant lui-même |

### EmptyState — composition

`EmptyState` est une molécule (couche 03) qui prend :

- `icon` (atome `RiIcon` ou illustration),
- `title` (libellé court),
- `description` (texte explicatif facultatif),
- slot `actions` (un ou deux boutons CTA),
- prop `variant: 'default' | 'error' | 'no-results'`.

### Variantes contextualisées

- `empty-initial` : aucune donnée n'a jamais été créée. Le CTA pousse à la création
  (`Créer une offre`).
- `empty-no-results` : les filtres masquent tout. Le CTA pousse à la **réinitialisation
  des filtres**, pas à la création.
- `error` : présente le message technique de manière humaine + bouton « Réessayer ».

### Skeleton

- Le skeleton ne dure jamais moins de 200 ms (évite le clignotement) ni plus de 5 s
  (au-delà, on affiche un message d'attente avec progression).
- La structure du skeleton **doit ressembler** au contenu final (nombre de lignes,
  hauteur des cartes), pas un placeholder générique.

## Conséquences

- Chaque section de liste a 4 stories Storybook (`Default`, `Loading`, `Empty`, `Error`),
  documentant les 4 états visuellement.
- Les stores Pinia exposent un statut (`idle | loading | ready | error`) consommable par
  le composant de section.
- L'usage de spinners pleine page est interdit hors transition de route ; tout chargement
  in-app est skeleton.

## Alternatives écartées

- **Spinner unique générique** — masque la mise en page, donne moins d'information sur
  l'attente.
- **Texte « Chargement… »** — peu professionnel sur une app dense, mauvais Cumulative
  Layout Shift.
- **Empty et error fusionnés** — l'utilisateur a besoin de savoir si **les données sont
  manquantes** ou si **la requête a échoué**, l'action n'est pas la même.
