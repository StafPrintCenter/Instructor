// src/data/training-students.ts
import type { LessonKind } from "@/data/content";
import type { AttendanceStatus } from "@/data/attendance";
import type { APIInstructorQuizAttemptFeedback } from "@/data/quiz-attempts";
import type {
  APIInstructorSubmission,
  APIInstructorSubmissionFeedback,
  SubmissionStatus,
} from "@/data/submissions";

/** GET /instructor/trainings/{trainingId}/students/{studentId} — clé "data" */
export interface APIInstructorTrainingStudentDetail {
  enrollmentId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  /** Seule la valeur "confirmed" a été observée — enum non communiqué */
  status: string;
  progress: number;
  paymentStatus: string;
  amountPaid: number;
  enrolledAt: string;
  completedAt: string | null;
}

export interface APIInstructorStudentLessonProgress {
  lessonId: string;
  lessonTitle: string;
  kind: LessonKind;
  /** Valeurs observées : "in_progress", "completed" — enum non communiqué */
  status: string;
  completionRatio: number;
  bestScore: number | null;
  completedAt: string | null;
  lastActivityAt: string | null;
}

export interface APIInstructorStudentQuizAttempt {
  attemptId: string;
  quizId: string;
  lessonTitle: string;
  attemptNumber: number;
  /** Valeurs observées : "graded", "expired" — enum non communiqué */
  status: string;
  score: number | null;
  isAutoSubmitted: boolean;
  startedAt: string;
  submittedAt: string | null;
  feedback: APIInstructorQuizAttemptFeedback | null;
}

export interface APIInstructorStudentSubmission {
  submissionId: string;
  lessonId: string;
  lessonTitle: string;
  body: string | null;
  fileUrl: string | null;
  status: SubmissionStatus;
  submittedAt: string;
  feedback: APIInstructorSubmissionFeedback | null;
}

export interface APIInstructorStudentAttendanceEntry {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedAt: string;
}

/** Réponse complète de GET /instructor/trainings/{trainingId}/students/{studentId} */
export interface APIInstructorStudentOverview {
  data: APIInstructorTrainingStudentDetail;
  lessonProgress: APIInstructorStudentLessonProgress[];
  quizAttempts: APIInstructorStudentQuizAttempt[];
  submissions: APIInstructorStudentSubmission[];
  attendance: {
    data: APIInstructorStudentAttendanceEntry[];
    ratio: number | null;
  };
}

/** Normalise une soumission du suivi apprenant vers le type de la liste (réutilise carte et dialog de notation). */
export function toInstructorSubmission(
  student: Pick<APIInstructorTrainingStudentDetail, "studentId" | "firstName" | "lastName">,
  s: APIInstructorStudentSubmission
): APIInstructorSubmission {
  return {
    id: s.submissionId,
    lessonId: s.lessonId,
    lessonTitle: s.lessonTitle,
    studentId: student.studentId,
    studentName: `${student.firstName} ${student.lastName}`.trim(),
    body: s.body,
    fileUrl: s.fileUrl,
    status: s.status,
    submittedAt: s.submittedAt,
    feedback: s.feedback,
  };
}

/* ------------------------- Libellés et couleurs ------------------------- */

const TONE = {
  success: "bg-success/15 text-success border-success/30",
  info: "bg-info/15 text-info border-info/30",
  danger: "bg-destructive/12 text-destructive border-destructive/30",
  muted: "bg-muted text-muted-foreground border-transparent",
};

const lessonProgressLabels: Record<string, string> = {
  in_progress: "En cours",
  completed: "Terminée",
};

export function getLessonProgressLabel(status: string): string {
  return lessonProgressLabels[status] ?? status;
}

export function getLessonProgressBadgeClass(status: string): string {
  if (status === "completed") return TONE.success;
  if (status === "in_progress") return TONE.info;
  return TONE.muted;
}

const quizAttemptLabels: Record<string, string> = {
  graded: "Corrigée",
  expired: "Expirée",
};

export function getQuizAttemptStatusLabel(status: string): string {
  return quizAttemptLabels[status] ?? status;
}

export function getQuizAttemptBadgeClass(status: string): string {
  if (status === "graded") return TONE.success;
  if (status === "expired") return TONE.danger;
  return TONE.muted;
}

export type EnrollmentStatus =
  | "confirmed"
  | "in_progress"
  | "completed"
  | "waiting_list"
  | "cancelled"
  | "expired";

const enrollmentStatusLabels: Record<EnrollmentStatus, string> = {
  confirmed: "Confirmée",
  in_progress: "En cours",
  completed: "Terminée",
  waiting_list: "Liste d'attente",
  cancelled: "Annulée",
  expired: "Expirée",
};

export function getEnrollmentStatusLabel(status: EnrollmentStatus): string {
  return enrollmentStatusLabels[status] ?? status;
}

export function getEnrollmentStatusBadgeClass(status: EnrollmentStatus): string {
  switch (status) {
    case "completed":
      return TONE.success;
    case "confirmed":
      return TONE.info;
    case "in_progress":
      return "bg-primary/10 text-primary border-primary/30";
    case "waiting_list":
      return "bg-accent/20 text-accent-foreground border-accent/40";
    case "cancelled":
      return TONE.danger;
    case "expired":
    default:
      return TONE.muted;
  }
}