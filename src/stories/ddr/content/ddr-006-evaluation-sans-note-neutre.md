---
title: DDR-006 — Évaluation sans note neutre
created: 2026-05-12
status: accepté
---

## Contexte

Les grilles d'évaluation post-entretien sont l'un des leviers les plus discutés en
recrutement. Les échelles disponibles vont de 3 à 10 niveaux, avec ou sans option neutre.
Les travaux de Google sur leur grille interne (4 niveaux sans neutre) et les pratiques
d'Ashby/Lever convergent sur un constat : **l'option neutre est sur-choisie par défaut**,
ce qui dilue le signal et oblige à compenser par des relances de la part des recruteurs.

## Décision

### Échelle à 4 niveaux, sans neutre

Chaque critère est noté sur une échelle de 4 :

- `1 — Fort non` (rouge)
- `2 — Non` (orange)
- `3 — Oui` (vert clair)
- `4 — Fort oui` (vert)

Aucune option neutre, aucun « non concerné », aucun champ vide. La case `commentaire` par
critère reste optionnelle.

### Recommandation globale

À la fin du formulaire, une recommandation globale obligatoire sur 3 niveaux :

- `oui`, `mitigé`, `non`.

Le `mitigé` global est autorisé car il représente une **synthèse** qualitative, pas une
note critère. Sans ce niveau, on observerait un biais de surclassement (« je préfère noter
oui faiblement que non »).

### Affichage agrégé

L'agrégation multi-intervieweurs (`EvaluationsAggregate`) affiche :

- une **heatmap** critère × intervieweur (4 niveaux de couleur),
- la **moyenne** par critère (1.0 à 4.0, sans arrondi affichant la dispersion),
- les **outliers** (note isolée à ± 2 d'écart) signalés visuellement,
- la **synthèse des recommandations globales** (`3 oui / 1 mitigé / 1 non`).

## Conséquences

- L'utilisateur ne peut pas soumettre un formulaire partiellement neutre ; le bouton
  « Soumettre » reste désactivé tant qu'un critère n'a pas été noté.
- Les comparaisons entre intervieweurs sont **lisibles** : pas de note moyenne ambiguë
  autour du milieu d'échelle.
- Le formulaire encourage des critères courts et concrets ; une grille trop longue avec
  une échelle binaire forte deviendrait pénible.

## Alternatives écartées

- **Échelle à 5 niveaux avec neutre** — sur-utilisation du neutre observée dans les
  benchmarks ; rend les bilans non actionnables.
- **Étoiles 1–5** — connote la qualité plus que la décision, encourage les notes flatteuses
  (« 4 étoiles par politesse »).
- **Slider continu** — illusion de précision, pénible au clavier, pas d'ancrage sémantique.
- **Skip optionnel par critère** — équivalent fonctionnel du neutre.
