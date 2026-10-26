import type { APIInstructorStudentListItem } from "@/data/students";
import type { EnrollmentStatus } from "@/data/training-students";
import { shiftDateKey, todayKey } from "@/lib/session-calendar";

/** Un travail non corrigé depuis plus de N jours est « en retard » (seuil à confirmer) */
export const OVERDUE_AFTER_DAYS = 3;
/** Nombre d'apprenants récupérés pour calculer les progressions (perPage maximum supposé) */
export const DASHBOARD_STUDENTS_PAGE_SIZE = 100;
/** Nombre d'éléments affichés dans les listes du tableau de bord */
export const DASHBOARD_LIST_SIZE = 5;
/** Sessions récupérées avant tri, pour viser les plus proches même si le back ne trie pas par date */
export const DASHBOARD_SESSIONS_FETCH_SIZE = 20;

const ACTIVE_ENROLLMENT_STATUSES: EnrollmentStatus[] = ["confirmed", "in_progress", "completed"];

export const isActiveEnrollment = (status: EnrollmentStatus) => ACTIVE_ENROLLMENT_STATUSES.includes(status);

/** Date limite (YYYY-MM-DD) au-delà de laquelle un travail non corrigé est en retard */
export const overdueThresholdDate = () => shiftDateKey(todayKey(), -OVERDUE_AFTER_DAYS);

export interface TrainingProgressSummary {
  learners: number;
  progress: number;
}

export interface StudentsSummary {
  /** Moyenne des progressions de toutes les inscriptions actives ; null s'il n'y en a aucune */
  averageProgress: number | null;
  byTraining: Record<string, TrainingProgressSummary>;
}

export function summarizeStudents(students: APIInstructorStudentListItem[]): StudentsSummary {
  const perTraining: Record<string, { sum: number; count: number }> = {};
  let sum = 0;
  let count = 0;

  for (const student of students) {
    for (const t of student.trainings) {
      if (!isActiveEnrollment(t.status)) continue;
      sum += t.progress;
      count += 1;
      const entry = perTraining[t.trainingId] ?? { sum: 0, count: 0 };
      entry.sum += t.progress;
      entry.count += 1;
      perTraining[t.trainingId] = entry;
    }
  }

  const byTraining: Record<string, TrainingProgressSummary> = {};
  for (const [trainingId, entry] of Object.entries(perTraining)) {
    byTraining[trainingId] = { learners: entry.count, progress: Math.round(entry.sum / entry.count) };
  }

  return { averageProgress: count > 0 ? Math.round(sum / count) : null, byTraining };
}

export function truncate(text: string, max = 16): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}