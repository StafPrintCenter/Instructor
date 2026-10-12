// src/stores/useTrainingStudentsStore.ts
import { useQueries, useQuery } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api-url";
import { parseApiError } from "@/lib/api-error";
import type { APIInstructorStudentOverview } from "@/data/training-students";

const resourceKey = "trainings";

const studentKey = (trainingId: string, studentId: string) =>
  [resourceKey, "student", trainingId, studentId] as const;

/** La réponse n'a pas la forme { data: T } : on renvoie l'objet complet. */
async function fetchTrainingStudent(
  trainingId: string,
  studentId: string
): Promise<APIInstructorStudentOverview | null> {
  const response = await instructorFetch(`/api/instructor/trainings/${trainingId}/students/${studentId}`);
  if (response.status === 404) return null;
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération du suivi de l'apprenant");
  return response.json();
}

export function useInstructorTrainingStudent(trainingId: string | undefined, studentId: string | undefined) {
  const query = useQuery({
    queryKey: studentKey(trainingId ?? "", studentId ?? ""),
    queryFn: () => fetchTrainingStudent(trainingId as string, studentId as string),
    enabled: !!trainingId && !!studentId,
    staleTime: 1000 * 30,
  });
  return {
    detail: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

/** Suivi de plusieurs apprenants en parallèle (partage le cache avec useInstructorTrainingStudent). */
export function useInstructorTrainingStudents(trainingId: string, studentIds: string[]) {
  const results = useQueries({
    queries: studentIds.map((studentId) => ({
      queryKey: studentKey(trainingId, studentId),
      queryFn: () => fetchTrainingStudent(trainingId, studentId),
      staleTime: 1000 * 30,
    })),
  });

  return {
    overviews: results.map((r) => r.data ?? null),
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
    refetch: () => Promise.all(results.map((r) => r.refetch())),
  };
}