import type { LessonKind } from "@/data/content";
import type { InstructorPaginationMeta } from "@/data/pagination";

export type SubmissionStatus = "submitted" | "under_review" | "validated" | "rejected";
export type SubmissionDecision = Exclude<SubmissionStatus, "submitted">;
export const SUBMISSION_STATUSES: SubmissionStatus[] = ["submitted", "under_review", "validated", "rejected"];
export const SUBMISSION_DECISIONS: SubmissionDecision[] = ["under_review", "validated", "rejected"];
export const GRADED_STATUSES: SubmissionStatus[] = ["validated", "rejected"];
export const PENDING_STATUSES: SubmissionStatus[] = ["submitted", "under_review"];
export type SubmissionKind = Extract<LessonKind, "exercise" | "assignment" | "project">;
export const SUBMISSION_KINDS: SubmissionKind[] = ["exercise", "assignment", "project"];
export const GRADED_FILTERS = ["all", "pending", "graded"] as const;
export type GradedFilter = (typeof GRADED_FILTERS)[number];

export const isGradedStatus = (status: SubmissionStatus): boolean => GRADED_STATUSES.includes(status);

export interface APIInstructorSubmissionFeedback {
  id: string;
  note: number | string | null;
  comment: string | null;
  validated: boolean;
}

/** GET /instructor/trainings/students/submissions/list */
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
  note?: number;
  comment?: string;
}

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
  query?: string;
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
};

export interface APIInstructorSubmissionFeedbackEntry {
  id: string;
  note: number | string | null;
  comment: string | null;
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
  enrollment: { id: string; progress: number } | null;
  feedbacks: APIInstructorSubmissionFeedbackEntry[];
  otherSubmissions: APIInstructorOtherSubmission[];
}


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

export const gradedFilterLabels: Record<GradedFilter, string> = {
  all: "Tous",
  pending: "À corriger",
  graded: "Corrigés",
};

export function getStatusesForGradedFilter(graded: GradedFilter): SubmissionStatus[] {
  if (graded === "pending") return PENDING_STATUSES;
  if (graded === "graded") return GRADED_STATUSES;
  return SUBMISSION_STATUSES;
}

export function sortFeedbacksDesc<T extends { gradedAt: string }>(feedbacks: T[]): T[] {
  return [...feedbacks]
    .sort((a, b) => new Date(b.gradedAt)
      .getTime() - new Date(a.gradedAt)
        .getTime());
}

export function getLatestFeedback<T extends { gradedAt: string }>(feedbacks: T[]): T | null {
  return sortFeedbacksDesc(feedbacks)[0] ?? null;
}