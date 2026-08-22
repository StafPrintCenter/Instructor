// src/data/categories.ts

/** Catégorie publique complète — GET /public/categories/list */
export interface APIPublicCategory {
  id: string;
  slug: string;
  name: string;
  colorClass: string;
  isTrainingTheme: boolean;
  isProjectCategory: boolean;
  isArticleCategory: boolean;
  isNewsletterCategory: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Sous-ensemble léger renvoyé imbriqué dans le profil formateur (GET /me, PUT /instructor/categories) */
export interface APIInstructorCategory {
  id: string;
  name: string;
  slug: string;
}