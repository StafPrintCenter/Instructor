import { useMemo } from "react";
import {
  DASHBOARD_LIST_SIZE,
  DASHBOARD_SESSIONS_FETCH_SIZE,
  DASHBOARD_STUDENTS_PAGE_SIZE,
  overdueThresholdDate,
  summarizeStudents,
} from "@/lib/dashboard";
import { useInstructorCorrectionsList } from "@/stores/useSubmissionsStore";
import { useInstructorSessionsList } from "@/stores/useSessionsStore";
import { useInstructorStudentsList } from "@/stores/useStudentsStore";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";

export function useDashboardTrainings() {
  const { items, isLoading, isError, refetch } = useInstructorTrainingsList();
  return { trainings: items, isLoading, isError, refetch };
}

/** Apprenants (première page élargie) + progressions agrégées par formation */
export function useDashboardStudents() {
  const { students, meta, isLoading, isError, refetch } = useInstructorStudentsList({
    page: 1,
    perPage: DASHBOARD_STUDENTS_PAGE_SIZE,
  });
  const summary = useMemo(() => summarizeStudents(students), [students]);

  return {
    students,
    total: meta?.total ?? students.length,
    /** true si certains apprenants ne sont pas pris en compte dans les moyennes */
    isTruncated: !!meta && meta.total > students.length,
    summary,
    isLoading,
    isError,
    refetch,
  };
}

/** Statistiques globales de correction + derniers travaux rendus (tous statuts) */
export function useDashboardCorrections() {
  const { stats, items, isLoading, isError, refetch } = useInstructorCorrectionsList({
    graded: "all",
    perPage: DASHBOARD_LIST_SIZE,
  });
  return { stats, latest: items, isLoading, isError, refetch };
}

/**
 * Travaux en attente déposés avant le seuil de retard, les plus anciens d'abord.
 * `stats` est calculé sur la période filtrée : `stats.pending` = nombre total de travaux en retard.
 */
export function useDashboardOverdue() {
  const { stats, items, isLoading, isError, refetch } = useInstructorCorrectionsList({
    graded: "pending",
    to: overdueThresholdDate(),
    perPage: DASHBOARD_LIST_SIZE,
  });
  return { overdueCount: stats?.pending ?? 0, overdue: items, isLoading, isError, refetch };
}

/** Prochaines sessions publiées, triées par date de début */
export function useDashboardUpcomingSessions() {
  const { items, meta, isLoading, isError, refetch } = useInstructorSessionsList({
    upcoming: true,
    status: "published",
    perPage: DASHBOARD_SESSIONS_FETCH_SIZE,
  });

  const sessions = useMemo(
    () =>
      [...items]
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
        .slice(0, DASHBOARD_LIST_SIZE),
    [items]
  );

  return { sessions, total: meta?.total ?? items.length, isLoading, isError, refetch };
}