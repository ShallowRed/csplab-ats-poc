---
title: DDR-009 — Densité réglable des listes
created: 2026-05-12
status: accepté
---

## Contexte

Les utilisateurs d'un ATS ont des profils d'usage hétérogènes :

- Le **RH expert** travaille sur un grand écran et veut voir 50+ lignes en un coup d'œil.
- Le **manager** consulte ponctuellement, préfère plus d'air et des informations
  hiérarchisées.
- Les **utilisateurs accessibilité** ont besoin d'un confort de lecture (hauteur ≥ 44 px,
  espacement augmenté).

Un seul réglage de densité ne couvre pas ces usages.

## Décision

### Trois densités

- `compact` — ligne ~ 28 px, padding minimal, idéal RH expert sur grand écran.
- `default` — ligne ~ 40 px, équilibre confort/densité, défaut produit.
- `comfortable` — ligne ~ 52 px, padding élargi, conforme aux recommandations
  d'accessibilité (cible tactile ≥ 44 px).

### Portée

- Le réglage est **global à l'application**, persisté dans le store `density` (qui
  persiste en localStorage).
- Toutes les listes et tables consomment ce réglage. Les kanbans ne sont **pas** affectés
  (taille de carte régie par le contenu).
- Le composant `DensitySelector` est exposé dans la `PageToolbar` des vues table ; il
  n'apparaît pas dans les vues qui n'en bénéficient pas (Dashboard, kanban).

### Implémentation visuelle

- La densité agit via un attribut `data-density="compact|default|comfortable"` posé sur
  le composant de table. Le CSS répond aux variantes via des sélecteurs d'attribut.
- Les espacements internes des cellules et la taille de police sont les seuls leviers ;
  les bordures et couleurs restent constantes.

## Conséquences

- Trois stories par section de table : `Compact`, `Default`, `Comfortable` (testables au
  rendu visuel).
- Le `DensitySelector` est en couche 05 (section générique) — réutilisable hors ATS.
- L'accessibilité tactile par défaut (cible ≥ 44 px) implique que `comfortable` soit le
  défaut sur mobile/tablette ; la détection se fait via le viewport.

## Alternatives écartées

- **Densité par utilisateur sans switcher visible** — peu découvrable, demande à passer
  par les paramètres.
- **Cinq niveaux** (very-compact, compact, normal, comfortable, very-comfortable) — choix
  excessif, paralyse l'utilisateur.
- **Densité par vue** — incohérent : un même utilisateur change de vue plusieurs fois par
  session, devoir reconfigurer chaque fois est pénible.
