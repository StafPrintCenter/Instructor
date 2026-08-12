import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/api-url";
import { createResourceStore } from "./createResourceStore";
import type { APIInstructorTrainingAssignment, APIInstructorTrainingOverview } from "@/data/trainings";

const resourceKey = "trainings";
const basePath = "trainings";

const store = createResourceStore<APIInstructorTrainingAssignment>({
  resourceKey,
  basePath,
});

export const fetchInstructorTrainings = store.fetchList;
export const useInstructorTrainingsList = store.useList;

async function fetchInstructorTrainingOverview(id: string): Promise<APIInstructorTrainingOverview | null> {
  const response = await adminFetch(`/api/instructor/${basePath}/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Erreur lors de la récupération de la formation`);
  return response.json();
}

export function useInstructorTrainingOverview(id: string | undefined) {
  const query = useQuery({
    queryKey: [resourceKey, "overview", id],
    queryFn: () => fetchInstructorTrainingOverview(id as string),
    enabled: !!id,
  });
  return {
    overview: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}