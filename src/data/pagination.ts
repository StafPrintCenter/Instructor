// src/data/pagination.ts

/** meta renvoyé par les listes paginées formateur (camelCase) */
export interface InstructorPaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}