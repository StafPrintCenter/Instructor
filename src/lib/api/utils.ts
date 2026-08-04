import type { Lesson, LessonType, ContentStatus, PaymentStatus, QuizAttempt, SubmissionStatus } from "./types";

/** Simulated network latency of the future Laravel REST API. */
export const LATENCY = 320;

export function delay<T>(payload: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(payload), ms));
}

export function fail(message: string, ms = LATENCY): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
}

export const uid = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;

export const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const nowIso = () => new Date().toISOString();

/* -------------------------------- labels --------------------------------- */

export const lessonTypeLabels: Record<LessonType, string> = {
  video: "Vidéo",
  reading: "Lecture",
  quiz: "Quiz",
  exercise: "Exercice",
  assignment: "Devoir",
  project: "Projet",
};

export const statusLabels: Record<ContentStatus, string> = {
  draft: "Brouillon",
  submitted: "En validation",
  approved: "Publié",
  rejected: "Refusé",
};

export const paymentLabels: Record<PaymentStatus, string> = {
  paid: "Soldé",
  partial: "Partiel",
  pending: "En attente",
  late: "En retard",
};

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  pending: "À corriger",
  graded: "Corrigé",
  returned: "Renvoyé",
};

/* ------------------------------- formatting ------------------------------- */

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days > 0) return `il y a ${days} j`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours > 0) return `il y a ${hours} h`;
  const minutes = Math.max(1, Math.floor(diff / 60_000));
  return `il y a ${minutes} min`;
}

export function daysSince(value: string) {
  return Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000);
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/* ----------------------------- business rules ----------------------------- */

/** Officiel : la meilleure tentative fait foi. */
export function bestAttempt(attempts: QuizAttempt[], lessonId: string): QuizAttempt | null {
  const scoped = attempts.filter((a) => a.lesson_id === lessonId);
  if (!scoped.length) return null;
  return scoped.reduce((best, a) => (a.score > best.score ? a : best));
}

/**
 * Progression recalculée depuis les interactions réelles :
 * vidéo/lecture terminée, exercice soumis, quiz avec meilleure note >= seuil.
 */
export function computeProgress(args: {
  publishedLessons: Lesson[];
  completedLessonIds: string[];
  submittedLessonIds: string[];
  attempts: QuizAttempt[];
}): number {
  const { publishedLessons, completedLessonIds, submittedLessonIds, attempts } = args;
  if (!publishedLessons.length) return 0;
  const done = publishedLessons.filter((lesson) => {
    if (lesson.type === "quiz") {
      const best = bestAttempt(attempts, lesson.id);
      return !!best && best.score >= (lesson.quiz?.pass_threshold ?? 100);
    }
    if (lesson.type === "exercise" || lesson.type === "assignment" || lesson.type === "project") {
      return submittedLessonIds.includes(lesson.id);
    }
    return completedLessonIds.includes(lesson.id);
  });
  return Math.round((done.length / publishedLessons.length) * 100);
}

export function reorder<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
