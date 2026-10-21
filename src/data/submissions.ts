import type { LessonKind } from "@/data/content";
import type { InstructorPaginationMeta } from "@/data/pagination";

export type SubmissionStatus = "submitted" | "under_review" | "validated" | "rejected";

/** Décisions documentées (OA) pour PUT .../submissions/{id}/grade */
export type SubmissionDecision = Exclude<SubmissionStatus, "submitted">;

export const SUBMISSION_STATUSES: SubmissionStatus[] = ["submitted", "under_review", "validated", "rejected"];
export const SUBMISSION_DECISIONS: SubmissionDecision[] = ["under_review", "validated", "rejected"];

export const instructorSubmissionStatusLabels: Record<SubmissionStatus, string> = {
  submitted: "Soumis",
  under_review: "En cours de correction",
  validated: "Validé",
  rejected: "Rejeté",
};

export const submissionDecisionLabels: Record<SubmissionDecision, string> = {
  under_review: "Mettre en cours de correction",
  validated: "Valider le travail",
  rejected: "Rejeter le travail",
};

export interface APIInstructorSubmissionFeedback {
  id: string;
  note: number | string | null; // number en liste, string ("60") dans la réponse de grade
  comment: string | null;
  validated: boolean;
}

/** GET /instructor/trainings/submissions/list */
export interface APIInstructorSubmission {
  id: string;
  lessonId: string;
  lessonTitle: string;
  studentId: string;
  studentName: string;
  body: string | null;
  fileUrl: string | null;
  status: SubmissionStatus;
  submittedAt: string;
  feedback: APIInstructorSubmissionFeedback | null;
}

/** Réponse de PUT .../grade - n'inclut ni body ni fileUrl */
export interface APIInstructorSubmissionGraded {
  id: string;
  lessonId: string;
  lessonTitle: string;
  studentId: string;
  studentName: string;
  status: SubmissionStatus;
  submittedAt: string;
  feedback: APIInstructorSubmissionFeedback;
}

export interface InstructorSubmissionGradePayload {
  decision: SubmissionDecision;
  /** Entier 0-100, optionnel */
  note?: number;
  /** 3000 caractères max, optionnel */
  comment?: string;
}

/* ------------------------ Corrections (liste globale) ------------------------ */

/** Types de leçon filtrables côté API (paramètre `kind`) */
export type SubmissionKind = Extract<LessonKind, "exercise" | "assignment" | "project">;
export const SUBMISSION_KINDS: SubmissionKind[] = ["exercise", "assignment", "project"];

/** Paramètre `graded` : "pending" = soumis / en cours de revue, "graded" = validés ou rejetés */
export type GradedFilter = "all" | "pending" | "graded";

export const gradedFilterLabels: Record<GradedFilter, string> = {
  all: "Tous",
  pending: "À corriger",
  graded: "Corrigés",
};

/** Item de GET /instructor/trainings/submissions/list (clé = submissionId, pas de champ `id`) */
export interface APIInstructorCorrectionListItem {
  submissionId: string;
  status: SubmissionStatus;
  isGraded: boolean;
  submittedAt: string;
  hasFile: boolean;
  hasText: boolean;
  studentId: string;
  studentName: string;
  studentEmail: string;
  lessonId: string;
  lessonTitle: string;
  lessonKind: LessonKind;
  trainingId: string;
  trainingTitle: string;
  enrollmentId: string | null;
  /** Dernier retour uniquement (sans commentaire) ; null si jamais corrigé */
  feedback: {
    note: number | string | null;
    validated: boolean;
    gradedAt: string;
  } | null;
}

/** Calculé sur le périmètre (formation, apprenant, type, dates, recherche), indépendamment des filtres de statut */
export interface APIInstructorCorrectionStats {
  total: number;
  pending: number;
  graded: number;
  byStatus: Record<SubmissionStatus, number>;
}

export interface APIInstructorCorrectionsListResponse {
  stats: APIInstructorCorrectionStats;
  data: APIInstructorCorrectionListItem[];
  meta: InstructorPaginationMeta;
}

/** Paramètres de la liste (alias de type, pas interface : assignable à Record<string, string | number | undefined>) */
export type InstructorCorrectionsFilters = {
  graded?: GradedFilter;
  status?: SubmissionStatus;
  trainingId?: string;
  studentId?: string;
  kind?: SubmissionKind;
  /** Nom/email de l'apprenant ou titre de la leçon */
  query?: string;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD, >= from
  page?: number;
  perPage?: number;
};

/* ----------------------- Détail d'une soumission ----------------------- */

export interface APIInstructorSubmissionFeedbackEntry {
  id: string;
  note: number | string | null;
  comment: string | null;
  /** true si la décision enregistrée était "validated" ; false pour under_review / rejected */
  validated: boolean;
  instructorId: string;
  instructorName: string;
  gradedAt: string;
}

export interface APIInstructorOtherSubmission {
  submissionId: string;
  status: SubmissionStatus;
  submittedAt: string;
  feedbacks: APIInstructorSubmissionFeedbackEntry[];
}

/** Clé "data" de GET /instructor/trainings/submissions/{id} */
export interface APIInstructorSubmissionDetail {
  submissionId: string;
  status: SubmissionStatus;
  body: string | null;
  fileUrl: string | null;
  submittedAt: string;
  student: { id: string; name: string; email: string };
  lesson: {
    id: string;
    title: string;
    kind: LessonKind;
    brief: string | null;
    instructions: string | null;
    isMandatory: boolean;
  };
  training: { id: string; title: string };
  /** null si la soumission n'est pas rattachée à une inscription */
  enrollment: { id: string; progress: number } | null;
  feedbacks: APIInstructorSubmissionFeedbackEntry[];
  otherSubmissions: APIInstructorOtherSubmission[];
}

export function sortFeedbacksDesc<T extends { gradedAt: string }>(feedbacks: T[]): T[] {
  return [...feedbacks].sort((a, b) => new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime());
}

export function getLatestFeedback<T extends { gradedAt: string }>(feedbacks: T[]): T | null {
  return sortFeedbacksDesc(feedbacks)[0] ?? null;
}