---
title: DDR-003 — Zone de refus implicite plutôt que colonne « Refusé »
created: 2026-05-12
status: accepté
---

## Contexte

Le pipeline ATS comporte des étapes terminales négatives (« Refusée », « Archivée ») qui
représentent une part importante du volume — typiquement 60–80 % des candidatures finissent
refusées. Les afficher comme des colonnes kanban classiques pose plusieurs problèmes :

- Les colonnes terminales accumulent un volume disproportionné, déséquilibrent
  visuellement le board et exigent du scroll.
- Refuser une candidature est une **décision** (avec motif et template de mail), pas un
  simple changement de colonne. Un drag-drop silencieux est inadapté.
- L'information utile post-refus (motif, date, auteur) n'a pas sa place dans une carte de
  pipeline actif.

## Décision

La colonne « Refusée » n'apparaît pas dans le kanban. À la place :

- Une **zone de refus** (`RefusalDropZone`) apparaît en bas du board lors d'un drag, sur
  toute la largeur, avec un visuel d'avertissement.
- Le drop dans cette zone déclenche un **dialogue de confirmation**
  (`RefusalReasonDialog`) qui exige :
  - le choix d'un motif (radio, sans option par défaut),
  - le choix d'un template de notification (avec aperçu).
- La validation déplace la candidature vers l'étape terminale « Refusée » et n'apparaît
  plus dans le kanban. Le toast de confirmation propose une **annulation** (undo) pendant 10 s.
- Les candidatures refusées restent accessibles depuis la vue **Liste** avec un filtre
  `etape:refusée` explicite.

## Conséquences

- Le kanban reste centré sur le pipeline **actif**, lisible sur un écran sans scroll
  horizontal pour les pipelines standards (≤ 6 étapes utiles).
- Le refus devient un **acte intentionnel** : impossible de refuser par erreur en glissant
  trop loin.
- L'archivage suit le même pattern (zone d'archivage masquée par défaut, accessible via
  bulk actions sur la liste).
- Le `RefusalDropZone` n'est visible qu'en cours de drag ; il ne consomme pas d'espace au
  repos.

## Alternatives écartées

- **Colonne refusée classique** — accumule le volume, banalise la décision, ne capture pas
  le motif.
- **Bouton « Refuser » sur la carte uniquement** — pas de geste direct dans le kanban,
  pénalise l'usage tactile/trackpad.
- **Confirmation in-place** (le motif s'ajoute dans la colonne) — rompt le rythme du
  drag-drop, demande un re-clic.
