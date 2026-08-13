export type ContentStatus = "draft" | "pending_review" | "published" | "rejected";
export type LessonKind = "video" | "reading" | "quiz" | "exercise" | "assignment" | "project";

export interface APIInstructorModule {
  id: string;
  trainingId: string;
  title: string;
  description: string | null;
  sortOrder: number | string; // ⚠️ l'API renvoie tantôt un number (list), tantôt une string (create/update) — à confirmer
  isEnabled: boolean;
  status: ContentStatus;
  lessonsCount: number;
  createdAt: string;
}

export interface InstructorModulePayload {
  title: string;
  description?: string;
  sort_order?: number;
}

export interface APIInstructorLessonChapter {
  [key: string]: unknown; // forme interne non confirmée
}

export interface APIInstructorLesson {
  id: string;
  moduleId: string;
  title: string;
  sortOrder: number | string; // même remarque que pour le module
  durationMinutes: number | string | null;
  kind: LessonKind;
  content: string | null;
  videoUrl: string | null;
  chapters: APIInstructorLessonChapter[] | null;
  brief: string | null;
  isMandatory: boolean;
  status: ContentStatus;
  createdAt: string;
}

export interface InstructorLessonPayload {
  title: string;
  sort_order?: number;
  duration_minutes?: number;
  kind: LessonKind;
  content?: string;
  video_url?: string;
  chapters?: unknown[]; // sérialisé en JSON string côté FormData
  brief?: string;
  is_mandatory?: boolean;
}

export const lessonKindLabels: Record<LessonKind, string> = {
  video: "Vidéo",
  reading: "Lecture",
  quiz: "Quiz",
  exercise: "Exercice",
  assignment: "Travail à rendre",
  project: "Projet",
};

export const contentStatusLabels: Record<ContentStatus, string> = {
  draft: "Brouillon",
  pending_review: "En attente de validation",
  published: "Publié",
  rejected: "Rejeté",
};