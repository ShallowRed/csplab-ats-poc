---
title: DDR-007 — Chips actives + Popover avancé pour les filtres
created: 2026-05-12
status: accepté
---

## Contexte

Le filtrage est l'opération la plus fréquente sur les listes/kanbans d'un ATS : par offre,
étape, score, intervieweur, tag, urgence, date d'activité. Deux écueils classiques :

- **Sur-visibilité** : un panneau de filtres latéral toujours ouvert mange 20–30 % de la
  largeur utile et reste vide la plupart du temps.
- **Sous-visibilité** : des filtres masqués derrière un seul bouton « Filtres » cachent
  les filtres actifs, ce qui produit des résultats incompréhensibles (« où sont les
  candidats ? »).

## Décision

### Deux composants distincts, complémentaires

- **`FilterPopover`** — porte la **composition** des filtres : un bouton dans la toolbar
  ouvre un popover qui liste tous les critères disponibles, avec leurs contrôles
  (multi-select, range, date picker). Le popover ne sert qu'à *ajouter ou modifier* des
  filtres.
- **`FilterChips`** — affiche en permanence les filtres **actifs** sous forme de chips
  inline dans la toolbar. Chaque chip :
  - rend le libellé canonique du filtre + valeur (`Étape : Entretien RH`),
  - permet la suppression individuelle (croix à droite),
  - cliquable pour ré-éditer (rouvre le popover sur ce critère).
- Un bouton **« Réinitialiser »** s'affiche dès qu'au moins un filtre est actif.

### Règles d'affichage

- Les chips s'affichent toujours, même si elles débordent (scroll horizontal interne
  plutôt que masquage).
- L'ordre des chips suit l'ordre d'application (la dernière modifiée à droite), pas un
  ordre fixe.
- Le compteur de résultats apparaît à côté du label de la vue (`Candidatures · 47`),
  pas dans la zone de filtres.
- La recherche textuelle plein-texte est traitée comme un filtre **à part** (champ visible
  dans la toolbar), pas une chip, parce qu'elle est utilisée différemment (frappe rapide).

### Persistance

- Les filtres sont stockés dans le store `filters` Pinia, partagé entre vues (liste et
  kanban d'une même offre).
- Les filtres sont sérialisés dans l'URL pour le partage et l'historique du navigateur.

## Conséquences

- L'utilisateur voit toujours ce qui restreint la vue : aucun « pourquoi je vois si peu de
  résultats » non résolu.
- Le popover peut être riche (sections, recherche interne) sans encombrer l'écran au repos.
- `FilterChips` est en couche 05 (section générique) — réutilisable hors ATS — et possède
  une déclinaison **métier** dans `OffreSelector` qui hérite du même pattern.

## Alternatives écartées

- **Panneau latéral fixe** — espace gaspillé, friction visuelle.
- **Filtres uniquement dans un popover, sans chips** — perd la visibilité des filtres
  actifs.
- **Filtres en headers de colonne (table)** — pas portable au kanban et invisible pour les
  vues qui n'affichent pas la colonne concernée.
