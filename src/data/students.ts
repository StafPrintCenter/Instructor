// src/data/students.ts
import type { TrainingStatus } from "@/data/trainings";
import type {
  APIInstructorStudentAttendanceEntry,
  APIInstructorStudentLessonProgress,
  APIInstructorStudentQuizAttempt,
  APIInstructorStudentSubmission,
} from "@/data/training-students";

/** Formation d'un apprenant, version résumée — GET /instructor/trainings/students/list */
export interface APIInstructorStudentListTraining {
  enrollmentId: string;
  trainingId: string;
  trainingTitle: string;
  /** Valeurs observées : "confirmed", "completed" — enum non communiqué */
  status: string;
  progress: number;
  paymentStatus: string;
}

/** Item de GET /instructor/trainings/students/list (pas de champ `id`, la clé est `studentId`) */
export interface APIInstructorStudentListItem {
  studentId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  trainingsCount: number;
  averageProgress: number;
  lastActivityAt: string | null;
  trainings: APIInstructorStudentListTraining[];
}

/** Clé "data" de GET /instructor/trainings/students/{studentId} */
export interface APIInstructorStudentProfile {
  studentId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  bio: string | null;
  occupation: string | null;
  trainingsCount: number;
  averageProgress: number;
}

export interface APIInstructorStudentEnrollment {
  enrollmentId: string;
  status: string;
  progress: number;
  paymentStatus: string;
  amountPaid: number;
  enrolledAt: string;
  completedAt: string | null;
}

/** Suivi d'un apprenant dans une formation donnée */
export interface APIInstructorStudentTrainingFollowUp {
  trainingId: string;
  trainingTitle: string;
  trainingStatus: TrainingStatus;
  enrollment: APIInstructorStudentEnrollment;
  lessonProgress: APIInstructorStudentLessonProgress[];
  quizAttempts: APIInstructorStudentQuizAttempt[];
  submissions: APIInstructorStudentSubmission[];
  attendance: {
    data: APIInstructorStudentAttendanceEntry[];
    ratio: number | null;
  };
}

/** Réponse complète de GET /instructor/trainings/students/{studentId} */
export interface APIInstructorStudentGlobalOverview {
  data: APIInstructorStudentProfile;
  trainings: APIInstructorStudentTrainingFollowUp[];
}