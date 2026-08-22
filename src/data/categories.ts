/** Catégorie publique complète */
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

/** Sous-ensemble dans le profil formateur */
export interface APIInstructorCategory {
  id: string;
  name: string;
  slug: string;
}