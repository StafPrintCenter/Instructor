import { useQuery } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type { InstructorPaginationMeta } from "@/data/pagination";
import type { APIInstructorStudentGlobalOverview, APIInstructorStudentListItem } from "@/data/students";
import { createResourceStore } from "./createResourceStore";

const resourceKey = "students";
const basePath = "trainings/students";

const store = createResourceStore<APIInstructorStudentListItem & { id: string }>({ resourceKey, basePath });

export const fetchInstructorStudents = store.fetchList;

type ListParams = Parameters<typeof store.useList>[0];

/** Liste paginée : useInstructorStudentsList({ page }) → /api/instructor/trainings/students/list?page=... */
export function useInstructorStudentsList(params: ListParams = {}) {
  const { items, meta, isLoading, isError, refetch } = store.useList(params);
  const students: APIInstructorStudentListItem[] = items;
  return { students, meta: meta as InstructorPaginationMeta | null, isLoading, isError, refetch };
}

/* ---- Vue globale d'un apprenant : forme { data, trainings } ≠ { data: T } ---- */

async function fetchStudentGlobal(studentId: string): Promise<APIInstructorStudentGlobalOverview | null> {
  const response = await instructorFetch(`/api/instructor/${basePath}/${studentId}`);
  if (response.status === 404) return null;
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération de l'apprenant");
  return response.json();
}

export function useInstructorStudentGlobal(studentId: string | undefined) {
  const query = useQuery({
    queryKey: ["trainings", "students", "detail", studentId ?? ""],
    queryFn: () => fetchStudentGlobal(studentId as string),
    enabled: !!studentId,
    staleTime: 1000 * 30,
  });
  return {
    overview: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}