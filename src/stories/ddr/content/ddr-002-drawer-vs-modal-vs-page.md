---
title: DDR-002 — Drawer persistant pour le détail candidat
created: 2026-05-12
status: accepté
---

## Contexte

Le détail d'une candidature est la vue la plus fréquentée d'un ATS : un recruteur l'ouvre
des dizaines de fois par session pour lire un CV, prendre une note, planifier un
entretien, ajouter un tag. Trois patterns sont possibles :

1. **Page dédiée** — un clic sur une ligne ou une carte navigue vers `/candidatures/:id`.
2. **Modale centrée** — un overlay couvre l'écran, focus piégé jusqu'à fermeture.
3. **Drawer latéral** — un panneau s'ouvre à droite, la liste/kanban reste visible.

Les ATS de référence (Ashby, Lever, Greenhouse) ont tous convergé sur le drawer, y compris
quand une route dédiée existe en parallèle.

## Décision

Le détail candidat est un **drawer latéral persistant** de 560 px, ouvert au-dessus du
contexte de liste (table ou kanban) sans démonter ce dernier. Une route `/candidatures/:id`
existe pour le partage par URL et l'accès direct, mais elle ouvre le même drawer
au-dessus d'une vue de liste filtrée.

### Comportements

- **Navigation séquentielle** — boutons précédent/suivant et raccourcis `J` / `K` parcourent
  les candidatures dans l'ordre courant de la liste sans fermer le drawer.
- **Fermeture** — `Esc` ou clic sur l'overlay ferme le drawer et restaure le focus sur la
  carte/ligne d'origine.
- **Lien plein écran** — un bouton « Ouvrir en pleine page » navigue vers la même URL
  partagée pour des sessions longues (relecture approfondie).
- **Empilement** — un seul drawer à la fois ; les dialogues critiques (refus, planification)
  s'ouvrent **par-dessus** le drawer sans le fermer.

## Conséquences

- Le contexte de liste n'est jamais perdu : tri, filtres, sélection multiple persistent.
- La fiche candidat est implémentée comme une section ATS (couche 06), pas comme une vue
  (couche 07). Les vues n'utilisent la fiche que via le drawer.
- Le store `drawer` est responsable de l'ouverture/fermeture et de la liste ordonnée
  d'IDs courants, alimentée par la vue parente. Le drawer ne sait pas d'où il a été
  ouvert.
- Les modales restent réservées aux **décisions critiques** (refus, suppression) et aux
  **formulaires courts** (≤ 5 champs). Au-delà, on bascule en drawer ou en page.

## Alternatives écartées

- **Page dédiée uniquement** — fait perdre le contexte de liste, force des allers-retours,
  pénalise la productivité (cible : > 50 candidatures consultées/jour pour un RH actif).
- **Modale centrée** — couvre la liste, empêche les comparaisons rapides, ne supporte pas
  la nav séquentielle naturellement.
- **Split view permanent** (liste 50 % / fiche 50 %) — gâche l'espace en mode liste sans
  sélection, pénalise les vues kanban (déjà larges).
