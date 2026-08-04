# STAF Instructor Hub

Construis un espace Instructeur (Formateur) moderne, premium et production-ready pour STAF PRINT CENTER, studio créatif et centre de formation basé au Bénin. C'est le second espace d'un LMS dont l'espace Apprenant existe déjà : il doit partager exactement la même identité visuelle et la même architecture technique.

Stack & contraintes techniques (non négociables)

TanStack Start + TanStack Router (routing par fichiers dans src/routes/), TanStack Query pour les lectures.

TailwindCSS v4 via src/styles.css, shadcn/ui, Lucide React.

Toutes les données passent par une couche API mockée Promise-based avec latence simulée (~320 ms), structurée pour être remplacée plus tard par une API REST Laravel — même pattern que src/lib/api/ (fichiers types.ts, mock-data.ts, utils.ts, index.ts).

Aucune donnée en dur dans les composants, aucun useEffect de fetch : loader + useSuspenseQuery.

Design (reprendre l'existant à l'identique)

Palette existante : off-white chaud / slate profond, accent ambre, dark mode complet, tokens sémantiques uniquement (jamais de text-white, bg-[#...]).

Typographie : Fraunces (titres, --font-display) + Inter Tight (corps).

Esthétique SaaS premium, responsive, sidebar repliable avec profil + déconnexion en bas, recherche globale, toasts sonner.

Architecture des identités (à respecter)

Trois identités séparées : admins (backoffice), users = instructeurs (cet espace), students. L'espace instructeur est monté sous un layout dédié _instructor avec son propre guard d'authentification, distinct de _portal.

Fonctionnalités attendues

1. Authentification instructeur

Connexion, inscription (demande de compte soumise à validation admin → statut pending_review / approved / rejected), mot de passe oublié + reset, activation de compte.

Session persistée, provider d'auth séparé de celui des apprenants.

2. Dashboard instructeur

KPIs : formations assignées, apprenants actifs, soumissions en attente de correction, taux de complétion moyen, prochaines sessions.

Fil d'activité récente, rappels de corrections en retard.

3. Mes formations assignées

Liste des formations où l'instructeur est assigné (training_instructors). L'instructeur ne crée jamais une formation — seul l'admin le fait. Il remplit uniquement le contenu.

Détail formation : cohorte, dates, apprenants inscrits, avancement global.

4. Gestion des modules & leçons

CRUD complet des modules (créer, renommer, réordonner par drag ou boutons, activer/désactiver, supprimer).

CRUD des leçons par type : video, reading, quiz, exercise, assignment, project — avec les champs propres à chaque type (URL vidéo + chapitrage, contenu de lecture, brief, durée).

Statut de publication + workflow de validation admin (draft → submitted → approved / rejected avec commentaire admin, table content_reviews).

5. Constructeur de quiz & exercices

Éditeur de questions : choix unique et choix multiples, ajout/suppression/réordonnancement, définition des bonnes réponses, points.

Quiz : limite de temps configurable, seuil de réussite, nombre de tentatives.

Exercices : non chronométrés, correction manuelle possible.

Aperçu « vue apprenant ».

6. Suivi par apprenant

Liste des apprenants par formation avec progression, assiduité, statut de paiement (lecture seule), dernière activité.

Fiche apprenant détaillée : timeline des leçons complétées, historique des tentatives de quiz (toutes les tentatives, meilleure note retenue), soumissions d'exercices.

7. Correction & validation

File d'attente des soumissions à corriger (exercices, devoirs, projets).

Attribution d'une note (0–100), commentaire, validation ou renvoi pour reprise → alimente instructor_feedback côté apprenant.

Correction en lot possible, filtres par formation / type / ancienneté.

8. Sessions & calendrier

Planification de sessions live/présentiel, marquage de présence des apprenants (assiduité).

Vue calendrier mensuelle + liste.

9. Communauté & messagerie

Participation au fil communauté avec badge « Formateur », annonces épinglées par formation.

Messagerie avec les apprenants (fils de discussion) et notifications internes.

10. Profil & paramètres

Profil formateur (nom, titre, bio, spécialités, avatar), disponibilités, préférences de notification.

Règles métier à câbler

Un instructeur ne voit que les formations qui lui sont assignées, jamais les autres.

Aucun accès aux données de paiement en écriture (lecture seule sur le statut).

Toute création/modification de contenu part en draft et nécessite une validation admin avant publication.

La progression apprenant est recalculée à partir des vraies interactions (vidéo terminée, exercice soumis, quiz avec meilleure note ≥ seuil).

Les notes de quiz retiennent la meilleure tentative comme score officiel.

Livraison

Commence par une passe d'architecture (types + mock API + routes + layout), puis les écrans dans l'ordre : auth → dashboard → formations → modules/leçons → quiz builder → suivi apprenants → correction → sessions → communauté → profil. Métadonnées head() uniques par route. Typecheck propre à la fin.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/446dbc0b-8ba2-4e25-8644-e8e3cfb457d9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
