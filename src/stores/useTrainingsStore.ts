import { useQuery } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import { createResourceStore } from "./createResourceStore";
import type {
  APIInstructorTrainingAssignment,
  APIInstructorTrainingOverview,
  InstructorTrainingStudentsQuery,
} from "@/data/trainings";

const resourceKey = "trainings";
const basePath = "trainings";

const store = createResourceStore<APIInstructorTrainingAssignment>({
  resourceKey,
  basePath,
});

export const fetchInstructorTrainings = store.fetchList;
export const useInstructorTrainingsList = store.useList;

const defaultStudentsQuery: InstructorTrainingStudentsQuery = {
  query: "",
  sortBy: "default",
  sortDir: "desc",
  page: 1,
  perPage: 12,
};

async function fetchInstructorTrainingOverview(
  id: string,
  studentsQuery: InstructorTrainingStudentsQuery
): Promise<APIInstructorTrainingOverview | null> {
  const params = new URLSearchParams({
    sortBy: studentsQuery.sortBy,
    sortDir: studentsQuery.sortDir,
    page: String(studentsQuery.page),
    perPage: String(studentsQuery.perPage),
  });
  if (studentsQuery.query) params.set("query", studentsQuery.query);

  const response = await instructorFetch(`/api/instructor/${basePath}/${id}?${params.toString()}`);
  if (response.status === 404) return null;
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération de la formation");
  return response.json();
}

export function useInstructorTrainingOverview(
  id: string | undefined,
  studentsQuery: InstructorTrainingStudentsQuery = defaultStudentsQuery
) {
  const query = useQuery({
    queryKey: [resourceKey, "overview", id, studentsQuery],
    queryFn: () => fetchInstructorTrainingOverview(id as string, studentsQuery),
    enabled: !!id,
  });
  return {
    overview: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}