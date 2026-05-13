---
title: DDR-004 — Sélection multiple et bulk action bar
created: 2026-05-12
status: accepté
---

## Contexte

Un RH gère couramment des cohortes de 50 à 500 candidatures par offre. Les actions de
masse (changer d'étape, envoyer un mail template, ajouter un tag, refuser en lot) sont
décisives pour la productivité. Trois questions :

1. Quel geste sélectionne plusieurs lignes ?
2. Comment exposer les actions disponibles sur la sélection ?
3. Comment gérer la sélection au-delà de la page visible (pagination, virtual scroll) ?

## Décision

### Geste

- **Click simple** sur une ligne ouvre le drawer du candidat (cf. DDR-002).
- **Click sur la case à cocher** sélectionne la ligne sans ouvrir le drawer.
- **Shift+click** sur une case sélectionne la **plage** entre la dernière sélection et la
  ligne cliquée.
- **Cmd/Ctrl+click** sur une case toggle la sélection sans casser la plage courante.
- L'en-tête de colonne contient une case « tout sélectionner » qui agit sur la **page
  visible** uniquement.

### Bulk action bar

- Une barre flottante (`BulkActionBar`) apparaît en bas de l'écran dès qu'au moins une
  ligne est sélectionnée. Elle reste visible tant qu'une sélection existe, même au scroll.
- Elle expose :
  - le **compteur** de lignes sélectionnées,
  - une mention **« Sélectionner les N candidatures correspondant aux filtres »** si la
    sélection couvre toute la page visible et que d'autres pages existent (sélection
    étendue),
  - les actions globales triées par fréquence d'usage (changer étape, envoyer mail,
    tagger, refuser, archiver),
  - un bouton **« Effacer la sélection »** explicite.
- Les actions destructives (refuser, archiver) déclenchent une confirmation modale
  bloquante.

### Sélection étendue

- La sélection « tous les N » est **explicite** : l'utilisateur doit cliquer le lien
  d'extension. Sans clic, la sélection reste limitée à la page visible.
- L'extension survit aux changements de tri et de pagination mais est invalidée par tout
  changement de filtre.

## Conséquences

- Le `PageToolbar` bascule en **mode sélection** quand la bulk bar est active : il masque
  les filtres et n'affiche que les éléments contextuels à la sélection (compteur, actions
  rapides).
- La table partage le state de sélection via le store `selection` Pinia ; le drawer en est
  désolidarisé pour éviter qu'un click sur une carte ne réinitialise une sélection
  laborieusement constituée.
- L'undo est obligatoire pour toute action de masse irréversible visuellement (changement
  d'étape, refus). Toast 10 s avec bouton « Annuler ».

## Alternatives écartées

- **Sélection par défaut au click** — perd l'accès direct au drawer, force un mode dédié
  pour la sélection.
- **Action bar dans le header** — invisible au scroll d'une longue liste, peu
  reconnaissable comme « contextuelle à la sélection ».
- **Sélection totale implicite** (tout cliquer = tout sélectionner) — produit des actions
  de masse non intentionnelles, dangereuses sur un volume invisible.
