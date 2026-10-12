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

/** Réponse de PUT .../grade — n'inclut ni body ni fileUrl */
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