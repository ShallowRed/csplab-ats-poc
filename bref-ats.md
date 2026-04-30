## 1. Pourquoi cet atelier

Aujourd'hui, la fonction publique française ne dispose d'aucun outil commun pour gérer ses recrutements. Chaque administration travaille (bricolle ?) avec ses propres outils — souvent des boîtes mail, des tableurs, des SIRH non conçus pour ça — ce qui génère des délais, des pertes d'information et une expérience candidat dégradée et un coup d'usage élevé.

Notre objectif est de construire un **outil de recrutement (ATS) mutualisé**, conçu spécifiquement pour répondre aux contraintes de la FP : statuts, corps, grades, obligations réglementaires, et une grande diversité de processus selon les administrations.

L'atelier a pour objectif de **valider collectivement le périmètre du MVP** : ce qu'on livre en premier, ce qu'on reporte, et ce qu'on a besoin de clarifier. **Les participants sont invités à challenger les choix proposés** — les désaccords sont les moments les plus utiles de la session.

Un temps sera également consacré à identifier une fonctionnalité « coup de cœur » : celle qui, sans être indispensable dans le cadre d'un MVP, rendrait l'outil vraiment désirable pour les recruteurs.

## 2. Pour quels usagers construit-on cet ATS ?

Pour cadrer les priorités de l'outil, il faut d'abord savoir *pour qui* il est conçu. Lors du design sprint du 16.04.26, les participants ont cartographié les rôles impliqués dans le processus de recrutement à l'aide de l'exercice du *bullseye* (cible) : chaque rôle a été positionné selon son degré de centralité — **cœur** (mobilisé en permanence), **cercle intermédiaire** (régulièrement impliqué) ou **périphérie** (ponctuel ou support).

### Matrice consolidée par degré de centralité

| Cercle               | Rôle                                             | Score* | Justification                                                   |
| -------------------- | ------------------------------------------------ | ------ | --------------------------------------------------------------- |
| 🎯 **Cœur**          | Manager / N+1 demandeur                          | ●●●●●  | Au cœur dans 5/5 groupes ; initiateur du besoin                 |
| 🎯 **Cœur**          | Chargé de recrutement / RH recruteur             | ●●●●●  | Au cœur dans 5/5 groupes ; chef d'orchestre du processus        |
| 🎯 **Cœur**          | Gestionnaire RH de proximité                     | ●●●●○  | Au cœur dans 4/5 groupes ; interface administrative et candidat |
| 🟡 **Intermédiaire** | Candidat                                         | ●●●○○  | Présent partout mais rarement au cœur ; rôle paradoxal          |
| 🟡 **Intermédiaire** | Hiérarchie validante (N+2, RRH, directeur)       | ●●●○○  | Validation des postes et profils                                |
| 🟡 **Intermédiaire** | Fonctions financières (paie, contrôleur, budget) | ●●○○○  | Validation fiche financière et faisabilité budgétaire           |
| 🟡 **Intermédiaire** | Expert métier / Encadrant back-up                | ●●○○○  | Second avis technique ou opérationnel                           |
| ⚪ **Périphérie**     | Équipe d'accueil du futur recruté                | ●○○○○  | Intégration post-recrutement                                    |
| ⚪ **Périphérie**     | Contrôleurs externes (CBCM, AFNOR)               | ●○○○○  | Conformité réglementaire et qualité                             |
| ⚪ **Périphérie**     | Outils & SI (GSI, multidiffusion, CSP)           | ●○○○○  | Supports techniques de diffusion et gestion                     |
| ⚪ **Périphérie**     | Assistantes / support / publicateur              | ●○○○○  | Tâches logistiques (convocations, publications)                 |

*Score de centralité : ●●●●● = au cœur dans tous les groupes · ●○○○○ = mentionné par un seul groupe en périphérie*

### Trois éléments importants à retenir

Le **triangle décisionnel cœur** — manager (futur N+1 du candidat), chargé de recrutement, gestionnaire RH de proximité — est présent dans tous les groupes. C'est l'unité de base du processus : l'outil doit d'abord fluidifier leur travail et leurs interactions.

Le **candidat occupe une position paradoxale** : universellement reconnu mais rarement central dans l'organisation du travail. C'est probablement le principal levier d'amélioration pour créer une expérience de recrutement moderne dans la fonction publique.

Les **rôles de conformité et d'outils** (CBCM, AFNOR, GSI) apparaissent en périphérie mais peuvent être bloquants. Leur faible centralité visuelle ne doit pas faire oublier leur poids réglementaire.

## 3. Un parcours de recrutement en 7 grandes étapes

Une fois les usagers identifiés, les groupes ont reconstitué le parcours de recrutement idéal de bout en bout. Malgré la diversité des administrations représentées, un **parcours médian en 7 étapes** a émergé de manière convergente — **ce qui valide l'hypothèse qu'un outil commun est possible.**

| # | Étape                                  | Rôles                     | Actions                                                                                    |
| - | -------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------ |
| 1 | **Réception des candidatures**         | RH chargé du recrutement  | Réception notification, consultation des CV                                                |
| 2 | **Tri de 1er niveau (recevabilité)**   | RH recruteur, Manager N+1 | Analyse sur critères statutaires (corps, grade…), refus automatiques, mise en vivier       |
| 3 | **Pré-qualification / Pré-sélection**  | RH expérimenté, Recruteur | Contact téléphonique pour trier                                                            |
| 4 | **Entretien(s)**                       | Manager N+1, RH, Candidat | Convocation, organisation RDV, conduite d'entretien, compte rendu                          |
| 5 | **Avis / Classement / CR d'entretien** | Manager N+1, RH           | Saisie selon une grille, émission d'avis, demande de pièces complémentaires                |
| 6 | **Choix du candidat**                  | RH, Manager, CBCM         | Validation critères juridiques et réglementaires, information motivée à tous les candidats |
| 7 | **Finalisation**                       | Admin, Service RH         | Négociation salariale, récupération des documents administratifs requis                    |

## 4. Ce qui ne fonctionne pas aujourd'hui

Le parcours médian existe dans les têtes, mais il est rarement outillé de bout en bout. Six irritants reviennent de manière transversale dans les groupes — ce sont eux que l'ATS doit résoudre en priorité.

| Irritant                                           | Groupes        | Formulation type                                                                                   |
| -------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------- |
| **Outils éclatés et flux technique défaillant**    | G1, G3, G5     | « On sort de l'outil », « Pièces en dehors de l'outil », « Export/Import MANUEL »                  |
| **Délais longs / Processus chronophage**           | G2, G3, G4, G5 | « Délais longs », « Gros délais d'attente pour le candidat », « Chronophage »                      |
| **Manque de visibilité** *(candidat ET recruteur)* | G3, G4         | « Manque de visibilité du candidat sur l'état d'avancement », « Manque d'observabilité »           |
| **Course aux pièces / candidatures incomplètes**   | G2, G3, G5     | « Candidature incomplète », « Course aux pièces », « RGPD obligation de solliciter les documents » |
| **Volume / qualité des candidatures**              | G1, G2, G4     | « Beaucoup de candidatures mal qualifiées », « Plusieurs canaux, pas de vision globale »           |
| **Refus mal traités / non personnalisés**          | G2, G3, G5     | « Modèle type réponses dans outil + envoi en masse », « Réponse standard inappropriée »            |

## 5. Ce que l'atelier devra trancher

Si le parcours est partagé, les priorités ne le sont pas encore. Chaque groupe a fait émerger un angle distinctif qui pointe vers des besoins différents — parfois complémentaires, parfois en tension.

| Groupe | Angle dominant         | Question pour l'atelier                                                       |
| ------ | ---------------------- | ----------------------------------------------------------------------------- |
| G1     | UX outil               | Jusqu'où simplifie-t-on l'interface pour le MVP ?                             |
| G2     | Sourcing & négociation | Le MVP doit-il adresser l'attractivité, ou seulement le suivi ?               |
| G3     | IA de pré-analyse      | Une aide à la présélection est-elle réaliste dès le MVP ?                     |
| G4     | Visibilité candidat    | Quelle transparence minimale garantit-on au candidat dans le MVP ?            |
| G5     | Conformité & fraude    | Quelles contraintes réglementaires sont non-négociables dès le premier jour ? |

C'est précisément pour répondre à ces tensions que nous nous réunissons. L'atelier ne part pas de zéro : il s'appuie sur ce que les groupes ont déjà produit pour aller plus loin — et trancher.

## 6. Fonctionnalités différenciantes

Les groupes ont fait émerger des propositions qui vont au-delà du tronc commun. Certaines répondent à des spécificités propres à la fonction publique, d'autres apportent une vraie différenciation produit.

| Fonctionnalité                                                                 | Pourquoi ça compte                                                                                                       |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Cases statutaires natives** (titulaire / contractuel, RQTH, priorité légale) | Absent de tous les ATS du marché — indispensable en FP                                                                   |
| **Circuit de validation N+1/N+2 formalisé**                                    | Formalise le circuit décisionnel propre à la FP                                                                          |
| **Module fiche financière & négociation salariale**                            | Couvre les spécificités statutaires (BRH MOB, détachements)                                                              |
| **Présentation préalable des documents à fournir si retenu**                   | Fluidifie radicalement l'aval du recrutement                                                                             |
| **Vivier interministériel**                                                    | Voir comment un CV a déjà été traité dans le réseau — puissant pour la mobilité, nécessite une gouvernance RGPD claire   |
| **Garde-fou IA**                                                               | Possibilité de revoir les candidatures écartées par l'algorithme — condition d'acceptabilité dans un cadre administratif |
| **CR d'entretien auto-rempli depuis la fiche de poste**                        | Évite la double saisie, structure les entretiens, alimente l'analytique                                                  |
| **Compteur de délais multi-événements**                                        | Clé pour piloter la qualité de service candidat                                                                          |
| **Multidiffusion 1 clic + interop SIRH (RENOIRH)**                             | Condition sine qua non d'adoption dans l'écosystème public                                                               |
| **Relance automatique à 2 ans**                                                | Boucle de consentement RGPD-by-design intelligente                                                                       |
| **Génération d'offres attractives par IA**                                     | Levier d'attractivité côté employeur                                                                                     |
| **Page employeur interactive**                                                 | Angle marque employeur rarement adressé dans la sphère publique                                                          |
| **Chatbots candidat & recruteur**                                              | Assistance au candidat + copilote au recruteur                                                                           |
| **Mise en vivier discrète**                                                    | Levier opérationnel utile — à arbitrer sur le plan éthique                                                               |

L'atelier consacrera un temps à sélectionner la fonctionnalité coup de cœur : celle qui, sans être indispensable au MVP, rendrait l'outil vraiment désirable. Ces propositions en sont les candidates naturelles.
