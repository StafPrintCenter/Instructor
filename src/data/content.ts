export type LessonKind = "video" | "reading" | "quiz" | "exercise" | "assignment" | "project";
export type ContentStatus = "draft" | "pending_review" | "published" | "rejected";

export interface APIInstructorModule {
  id: string;
  trainingId: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isEnabled: boolean;
  status: ContentStatus;
  lessonsCount: number;
  createdAt: string;
}

export interface APIInstructorModuleListTrainingContext {
  id: string;
  title: string;
  level: string;
  status: ContentStatus;
  coverColor: string | null;
}

export interface APIInstructorModuleListEntry {
  training: APIInstructorModuleListTrainingContext;
  module: APIInstructorModule;
}

export interface InstructorModulePayload {
  title: string;
  description?: string;
  sort_order?: number;
}

export interface APIInstructorLesson {
  id: string;
  moduleId: string;
  title: string;
  sortOrder: number | string;
  durationMinutes: number | string | null;
  kind: LessonKind;
  content: string | null;
  videoUrl: string | null;
  chapters: string[] | null;
  brief: string | null;
  quizId: string | null;
  isMandatory: boolean;
  status: ContentStatus;
  createdAt: string;
}

export interface APIInstructorLessonListEntry {
  training: APIInstructorModuleListTrainingContext;
  module: Pick<APIInstructorModule, "id" | "trainingId" | "title" | "sortOrder" | "isEnabled" | "status">;
  lesson: APIInstructorLesson;
}

export interface InstructorLessonPayload {
  title: string;
  sort_order?: number;
  duration_minutes?: number;
  kind: LessonKind;
  content?: string;
  video_url?: string;
  chapters?: string[];
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

export function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export type QuizMode = "quiz" | "exercise";
export type QuizQuestionType = "single" | "multiple";

export const quizModeLabels: Record<QuizMode, string> = {
  quiz: "Quiz chronométré",
  exercise: "Exercice libre",
};

export const questionTypeLabels: Record<QuizQuestionType, string> = {
  single: "Choix unique",
  multiple: "Choix multiples",
};

export interface APIQuizChoice {
  id: string;
  label: string;
  isCorrect: boolean;
  sortOrder: number;
}

export interface APIQuizQuestion {
  id: string;
  prompt: string;
  type: QuizQuestionType;
  points: number | string;
  sortOrder: number | string;
  explanation: string | null;
  choices: APIQuizChoice[];
}

export interface APIQuiz {
  id: string;
  lessonId: string;
  mode: QuizMode;
  timeLimitSec: number | string | null;
  passScore: number | string;
  maxAttempts: number | string;
  totalPoints: number;
  autoSubmitOnTimeout: boolean;
  status: ContentStatus;
  questionsCount: number;
  questions?: APIQuizQuestion[];
  createdByAdmin?: string | null;
  createdByInstructor?: string | null;
  createdAt: string;
}

export interface QuizPayload {
  mode: QuizMode; /** Obligatoire si mode === "quiz" */
  time_limit_sec?: number;
  pass_score: number;
  max_attempts: number;
  auto_submit_on_timeout: boolean;
}

export interface QuizChoiceInput {
  label: string;
  is_correct: boolean;
}

export interface QuizQuestionPayload {
  prompt: string;
  type: QuizQuestionType;
  points: number;
  sort_order?: number;
  explanation?: string;
  choices: QuizChoiceInput[];
}