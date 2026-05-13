---
title: DDR-000 — Pourquoi des DDR (Design Decision Records)
created: 2026-05-13
status: accepté
---

# DDR-000 — Pourquoi des DDR (Design Decision Records)

## Statut

Accepté

## Contexte

La construction d'un design system ATS produit de nombreux choix de conception — choix
de patterns d'interaction, de hiérarchie de composants, de conventions de nommage, de
couches d'abstraction. Sans capitalisation structurée, ces décisions restent implicites
dans le code ou dans les échanges verbaux. Elles se perdent à chaque rotation d'équipe
et à chaque itération majeure.

L'équipe s'appuie sur les **ADR** (Architecture Decision Records, format Nygard) pour les
décisions d'infrastructure et de stack. Il manquait un format équivalent pour la dimension
*design* — un format qui réponde à la question : *« pourquoi ce composant existe sous cette
forme et pas une autre ? »* plutôt qu'à *« pourquoi cette technologie ? »*.

## Décision

Nous adoptons le format **DDR** (Design Decision Record), calqué sur le format ADR mais
centré sur les décisions de design d'interaction, de composition de composants et d'ergonomie.

### Format d'un DDR

Chaque DDR est un fichier Markdown structuré avec les sections suivantes :
frontmatter YAML (`title`, `created`, `status`), puis les sections `Statut`, `Contexte`, `Décision`, `Alternatives considérées`, `Conséquences`.

### Ce qui relève d'un DDR (et non d'un ADR)

| DDR | ADR |
|-----|-----|
| Choix d'un pattern d'interaction (drawer vs modal vs page) | Choix d'un framework ou d'une librairie |
| Conventions de composition de composants (couches, frontières) | Architecture système, découpage de services |
| Sémantique d'un élément visuel (badge, statut, densité) | Schéma de base de données, protocole d'API |
| Décisions d'ergonomie (évaluation sans note neutre) | Sécurité, performance, déploiement |

### Ce qui ne relève pas d'un DDR

- Les décisions réversibles sans coût significatif (couleur d'un bouton, libellé d'un label).
- Les détails d'implémentation purement techniques (type Vue prop, nom d'une fonction utilitaire).
- Les questions de stack (qui font l'objet d'ADR).

### Cycle de vie

Un DDR est créé **au moment de la décision**, pas a posteriori. Son statut évolue :

- **Proposé** — en discussion.
- **Accepté** — décision prise et appliquée.
- **Déprécié** — toujours en place mais plus recommandé pour les nouveaux développements.
- **Remplacé par DDR-XXX** — une décision ultérieure annule et remplace celle-ci.

## Alternatives considérées

### Ne rien formaliser

Rapide mais coûteux à moyen terme : les mêmes débats reviennent à chaque nouvelle itération,
les onboardings prennent plus de temps, et les cohérences visuelles dégradent sans
garde-fou documentaire.

### Wiki Confluence / Notion

Plus accessible pour les non-développeurs, mais découplé du code et du Storybook. Les DDR
en Markdown vivent dans le repo, sont versionnés avec le code, et sont exposés directement
dans le Storybook — un seul artefact de référence.

### Utiliser directement les ADR pour tout

Les ADR Nygard sont pensés pour l'architecture système. Leur vocabulaire (*« forces »*,
*« consequences »*) est mal adapté aux décisions d'interaction où on raisonne en termes
d'*alternatives UX*, d'*impact sur le flux utilisateur* et de *cohérence avec les tokens*.
Un format dédié permet un vocabulaire plus précis.

## Conséquences

- Les décisions de design sont tracées, datées et référençables dans les tickets et les
  revues de code.
- Le Storybook expose les DDR directement à côté des composants qu'ils concernent — la
  documentation et l'implémentation sont colocalisées.
- Chaque composant Storybook peut référencer les DDR qui justifient ses choix (via
  `parameters.docs.description` ou en lien depuis l'autodoc).
- Le format est léger : un DDR tient en une page, il n'est pas une spécification exhaustive.
