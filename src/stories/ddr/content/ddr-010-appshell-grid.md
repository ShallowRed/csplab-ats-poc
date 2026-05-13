---
title: DDR-010 — AppShell en grille Sidebar / Header / Content
created: 2026-05-12
status: accepté
---

## Contexte

L'AppShell est la coquille qui structure tous les écrans authentifiés de l'ATS. Trois
décisions structurelles s'y prennent :

1. Comment positionner navigation, header et contenu ?
2. Où s'ouvrent les drawers et modales ?
3. Comment l'écran s'adapte aux viewports ?

## Décision

### Layout en CSS Grid

L'AppShell utilise une grille CSS à deux colonnes et deux lignes :

```
┌───────────┬──────────────────────────────────────┐
│           │           Header contextuel (56 px)  │
│  Sidebar  ├──────────────────────────────────────┤
│  (240 px) │                                      │
│           │           Content scroll              │
│           │                                      │
└───────────┴──────────────────────────────────────┘
```

- **Sidebar** — `240 px` fixe (réductible en mode `icon` ; pas de redimensionnement
  arbitraire). Persistante. Contient la nav principale et les switchers d'apparence
  (thème, radius).
- **Header contextuel** — `56 px` de hauteur. Contenu fourni par chaque page via le store
  `pageHeader` (`title`, `breadcrumb`, slot d'actions). Hauteur constante quelle que soit
  la page : pas de layout shift à la navigation.
- **Content** — seule zone scrollable. La sidebar et le header ne scrollent pas.

### Slots overlay

- Le **drawer candidat** est un overlay positionné par-dessus la grille, fixé à droite,
  height 100 %. Il chevauche le header contextuel mais pas la sidebar (pour conserver la
  navigation).
- Les **modales** sont centrées par rapport à la viewport entière, y compris au-dessus du
  drawer si nécessaire.
- Les **toasts** apparaissent en bas à droite, au-dessus de toute la grille.

### Responsive

- Sous `1024 px`, la sidebar passe en mode `drawer` (cachée, ouvrable via bouton burger).
- Sous `768 px`, le header contextuel passe sur deux lignes si besoin (titre + actions).
- Le tableau bascule en mode `comfortable` automatiquement (cf. DDR-009).
- Le drawer candidat passe en `100 vw` (plein écran) avec bouton retour proéminent.

### Accessibilité

- Un **skip link** (`Aller au contenu principal`) précède la sidebar.
- L'ordre du DOM : `skip link → sidebar → header → content`.
- Le focus revient toujours au déclencheur après fermeture d'un drawer ou d'une modale.

## Conséquences

- La sidebar et le header sont des **sections génériques** (couche 05) : aucun élément
  spécifique ATS ne s'y trouve. Le store `pageHeader` est leur seule interface.
- Le contenu peut être pleinement responsable de sa propre mise en page sans se soucier
  de la coquille.
- La grille en CSS pur (pas de flex imbriqué) garantit la performance et la prédictibilité
  du layout.

## Alternatives écartées

- **Sidebar collapsible large/étroit** — produit deux états visuels riches, doublant la
  surface de design ; on préfère l'évolution iconique stricte.
- **Header global non contextuel** — empêche d'exposer les actions de page (filtre, vue,
  ajout) là où elles sont attendues.
- **Pas de header contextuel** (actions in-page) — fragmente la position des actions
  principales d'un écran à l'autre.
