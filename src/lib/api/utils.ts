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

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

