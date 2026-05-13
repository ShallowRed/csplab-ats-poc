---
title: DDR-005 — Badges sémantiques de statut
created: 2026-05-12
status: accepté
---

## Contexte

Les statuts (offre, candidature, étape, entretien, évaluation) sont partout dans une ATS.
Trois pièges récurrents :

1. La couleur seule ne suffit pas pour l'accessibilité (daltonisme, contraste).
2. Sans contrainte, chaque écran réinvente sa palette de statuts.
3. Les libellés varient (« Refusé » vs « Rejeté » vs « Non retenu »).

## Décision

### Catalogue fermé de variantes sémantiques

Les statuts sont implémentés comme un ensemble **fermé** de variantes du composant
`Badge`, défini en couche atome :

- `draft`, `submitted`, `screening`, `interview`, `offer`, `rejected`, `archived`.

Chaque variante encode :

- une **couleur de fond** issue des tokens `csplab-status-*`,
- une **couleur de texte** garantissant un contraste AAA,
- une **icône système** par défaut (`check`, `clock`, `x`, `inbox`…), désactivable via
  `:icon="false"`.

### Wrappers métier

Chaque entité métier qui porte un statut a son **wrapper domaine** en couche 04
(`OffreStatusBadge`, à venir : `CandidatureStatusBadge`, `EntretienStatusBadge`). Le
wrapper :

- prend en prop un **type métier** (`statut: OffreStatut`) — pas une variante générique,
- map le statut vers la variante atomique,
- impose un **libellé canonique** (centralisé, non surchargeable côté appelant).

### Tokens

La palette de statuts est définie une seule fois dans `src/styles/theme.css` sous le
préfixe `--csplab-status-*`. Aucun composant ne référence une couleur de statut en dur.

## Conséquences

- Impossible de créer un nouveau statut sans passer par le token + la variante de `Badge`
  + le mapping du wrapper : la dette de divergence est rendue coûteuse à introduire.
- Les libellés sont **traduits** dans les wrappers, pas dans les pages.
- L'icône embarquée par défaut donne une redondance forme + couleur conforme WCAG 1.4.1.
- Les filtres et chips de statut consomment le **même** mapping (pas de couleur dupliquée
  côté `FilterChips`).

## Alternatives écartées

- **Variantes ouvertes (`<Badge color="green">`)** — laisse passer toute couleur, perd
  l'unification.
- **Badge inline (`<span class="badge badge-green">`)** — duplication CSS, pas d'icône
  automatique, pas de typage.
- **Wrapper unique `<StatusBadge entity statut>`** — magique mais perd le typage TypeScript
  fort sur le statut spécifique à chaque entité.
